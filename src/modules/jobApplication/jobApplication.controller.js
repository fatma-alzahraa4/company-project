import { jobOfferModel } from "../../../DB/models/jobOfferModel.js"
import { jobApplicantModel } from "../../../DB/models/JobApplicantModel.js";
import { clientRedis, getOrSetCache } from "../../utils/redis.js";


//========================================================Dashboard APIs=======================================================


export const addJobOffer = async (req, res, next) => {
    const {
        jobTitle,
        address,
        employmentType,
        experienceYears,
        jobDetails,
        acceptedKeyWords,
        rejectedKeyWords,
    } = req.body
    const requiredInputs = [
        'jobTitle',
        'address',
        'employmentType',
        'experienceYears',
        'jobDetails',
    ];
    requiredInputs.forEach(input => {
        if (!req.body[`${input}`]) {
            return next(new Error(`Missing required field: ${input}`, { cause: 400 }));
        }
    });
    const jobOfferObj =
    {
        jobTitle,
        address,
        employmentType,
        experienceYears,
        jobDetails,
        acceptedKeyWords,
        rejectedKeyWords,
    }
    const jobOffer = await jobOfferModel.create(jobOfferObj)
    if (!jobOffer) {
        return next(new Error('Failed to create job offer', { cause: 400 }));
    }
    clientRedis.del('jobOffers');
    clientRedis.del('jobsWebsite');

    res.status(200).json({ message: 'Done', jobOffer })
}

export const editJobOffer = async (req, res, next) => {
    const { jobId } = req.params
    const {
        jobTitle,
        address,
        employmentType,
        experienceYears,
        jobDetails,
        acceptedKeyWords,
        rejectedKeyWords,
    } = req.body
    const jobOffer = await jobOfferModel.findById(jobId)
    if(!jobOffer){
        return next(new Error('Job offer not found. Please verify the ID and try again.', { cause: 404 }));
    }
    jobOffer.jobTitle = jobTitle || jobOffer.jobTitle;
    jobOffer.address = address || jobOffer.address;
    jobOffer.employmentType = employmentType || jobOffer.employmentType;
    jobOffer.experienceYears = experienceYears || jobOffer.experienceYears;
    jobOffer.jobDetails = jobDetails || jobOffer.jobDetails;
    jobOffer.acceptedKeyWords = acceptedKeyWords || jobOffer.acceptedKeyWords;
    jobOffer.rejectedKeyWords = rejectedKeyWords || jobOffer.rejectedKeyWords;

    const updatedJobOffer = await jobOffer.save()
    if(!updatedJobOffer){
        return next(new Error('Failed to update job offer', { cause: 400 }));
    }
    clientRedis.del('jobOffers');
    clientRedis.del('jobsWebsite');

    res.status(200).json({ message: 'Done', jobOffer: updatedJobOffer })
}

export const getJobOffers = async (req, res, next) => {
    const jobOffers = await getOrSetCache('jobOffers', async ()=>{
        const jobOffers = await jobOfferModel.find()
        const data = {jobOffers}
        return data
    })
    res.status(200).json({ message: 'Done', ...jobOffers })
}

export const getJobOffer = async (req, res, next) => {
    const { jobId } = req.params
    const jobOffer = await jobOfferModel.findById(jobId)
    res.status(200).json({ message: 'Done', jobOffer })
}

export const deleteJobOffer = async (req, res, next) => {
    const { jobId } = req.params
    const [deletedJob,deletedApplicants] = await Promise.all([
        jobOfferModel.findByIdAndDelete(jobId),
        jobApplicantModel.deleteMany({jobId})
    ]) 
    if(!deletedJob){
        return next(new Error('Failed to delete the job offer. Please verify the ID and try again.', { cause: 404 }));
    }
    clientRedis.del('jobOffers');
    clientRedis.del(`jobApplicants_${jobId}`);
    clientRedis.del('jobsWebsite');

    res.status(200).json({ message: 'Done' })
}

//========================================================Website APIs=======================================================


export const applyToJob = async (req, res, next) => {
    const { jobId } = req.params
    const {
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        portofolio,
        linkedIn,
        resume
    } = req.body
    const requiredInputs = [
        'firstName',
        'lastName',
        'email',
        'phoneNumber',
        'address',
        'resume',
    ];
    requiredInputs.forEach(input => {
        if (!req.body[`${input}`]) {
            return next(new Error(`Missing required field: ${input}`, { cause: 400 }));
        }
    });
    const job = await jobOfferModel.findById(jobId)
    if (!job) {
        return next(new Error('job offer not found. Please verify the ID and try again.', { cause: 404 }));
    }
    const urlParts = resume.split('/');
    const newResume = [...urlParts.slice(0, -1), 'preview'].join('/');
    const jobApplicantObj = {
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        portofolio,
        linkedIn,
        jobId,
        resume:newResume
    }
    const jobApplicant = await jobApplicantModel.create(jobApplicantObj)
    clientRedis.del(`jobApplicants_${jobId}`);
    clientRedis.del('jobsWebsite');

    res.status(200).json({ message: 'Done', jobApplicant })
}

export const getJobApplicants = async (req, res, next) => {
    const { jobId } = req.params
    const jobApplicants = await getOrSetCache(`jobApplicants_${jobId}`, async ()=>{
        const jobApplicants = await jobApplicantModel.find({ jobId })
        const data = {jobApplicants}
        return data
    })
    res.status(200).json({ message: 'Done', ...jobApplicants })
}

export const deleteJobApplicant = async (req, res, next) => {
    const { jobApplicantId } = req.params
    const deletedJobApplicant = await jobApplicantModel.findByIdAndDelete(jobApplicantId)
    if (!deletedJobApplicant) {
        return next(new Error('Failed to delete the job applicant. Please verify the ID and try again.', { cause: 400 }))
    }
    clientRedis.del('jobsWebsite');

    res.status(200).json({ message: 'Done' })
}