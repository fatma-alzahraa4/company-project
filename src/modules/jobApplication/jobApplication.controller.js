import { customAlphabet } from "nanoid";
// import pdfParse from 'pdf-parse';  
// import pdfParse from 'pdf-parse';
// import fs from 'fs'; 
import { jobOfferModel } from "../../../DB/models/jobOfferModel.js"
import cloudinary from "../../utils/cloudinaryConfigrations.js";
import { jobApplicantModel } from "../../../DB/models/JobApplicantModel.js";
const nanoId = customAlphabet('abcdefghijklmnopqrstuvwxyz123456890', 5)
const getFileNameWithoutExtension = (filename) => {
    return filename.split('.').slice(0, -1).join('.');
};


//========================================================Dashboard APIs=======================================================


export const addJobOffer = async (req, res, next) => {
    const {
        jobTitle,
        address,
        employmentType,
        experienceYears,
        jobPurpose,
        jobResponsabilities,
        jobRequirements,
        acceptedKeyWords,
        rejectedKeyWords,
    } = req.body

    if (!jobTitle || !address || !employmentType || !experienceYears || !jobPurpose || !jobResponsabilities || !jobRequirements) {
        return next(new Error('Please Enter All Required Fields', { cause: 400 }))
    }
    const jobOfferObj =
    {
        jobTitle,
        address,
        employmentType,
        experienceYears,
        jobPurpose,
        jobResponsabilities,
        jobRequirements,
        acceptedKeyWords,
        rejectedKeyWords,
    }
    const jobOffer = await jobOfferModel.create(jobOfferObj)
    if (!jobOffer) {
        return next(new Error('creation failed', { cause: 400 }))
    }
    res.status(200).json({ message: 'Done', jobOffer })
}

export const editJobOffer = async (req, res, next) => {
    const { jobId } = req.params
    const {
        jobTitle,
        address,
        employmentType,
        experienceYears,
        jobPurpose,
        jobResponsabilities,
        jobRequirements,
        acceptedKeyWords,
        rejectedKeyWords,
    } = req.body

    const jobOffer = await jobOfferModel.findById(jobId)

    jobOffer.jobTitle = jobTitle || jobOffer.jobTitle;
    jobOffer.address = address || jobOffer.address;
    jobOffer.employmentType = employmentType || jobOffer.employmentType;
    jobOffer.experienceYears = experienceYears || jobOffer.experienceYears;
    jobOffer.jobPurpose = jobPurpose || jobOffer.jobPurpose;
    jobOffer.jobResponsabilities = jobResponsabilities || jobOffer.jobResponsabilities;
    jobOffer.jobRequirements = jobRequirements || jobOffer.jobRequirements;
    jobOffer.acceptedKeyWords = acceptedKeyWords || jobOffer.acceptedKeyWords;
    jobOffer.rejectedKeyWords = rejectedKeyWords || jobOffer.rejectedKeyWords;

    const updatedJobOffer = await jobOffer.save()
    res.status(200).json({ message: 'Done', jobOffer: updatedJobOffer })
}

export const getJobOffers = async (req, res, next) => {
    const jobOffers = await jobOfferModel.find()
    res.status(200).json({ message: 'Done', jobOffers })
}

export const getJobOffer = async (req, res, next) => {
    const { jobId } = req.params
    const jobOffer = await jobOfferModel.findById(jobId)
    res.status(200).json({ message: 'Done', jobOffer })
}

export const deleteJobOffer = async (req, res, next) => {
    const { jobId } = req.params
    await jobOfferModel.findByIdAndDelete(jobId)
    res.status(200).json({ message: 'Done' })
}

//========================================================Website APIs=======================================================



// const filterResumeByKeywords = async (pdfBuffer, jobId) => {
//     const job = await jobOfferModel.findById(jobId);
//     if (!job) {
//         throw new Error('Job offer not found');
//     }

//     const acceptedKeyWords = job.acceptedKeyWords || [];
//     const rejectedKeyWords = job.rejectedKeyWords || [];

//     // Parse the PDF buffer directly from req.file.buffer
//     const pdfData = await pdfParse(pdfBuffer);
//     const text = pdfData.text.toLowerCase();

//     let acceptedKeywordCount = 0;
//     let rejectedKeywordCount = 0;

//     acceptedKeyWords.forEach(keyword => {
//         const keywordLower = keyword.toLowerCase();
//         const keywordCount = (text.match(new RegExp(keywordLower, 'g')) || []).length;
//         acceptedKeywordCount += keywordCount;
//     });

//     rejectedKeyWords.forEach(keyword => {
//         const keywordLower = keyword.toLowerCase();
//         const keywordCount = (text.match(new RegExp(keywordLower, 'g')) || []).length;
//         rejectedKeywordCount += keywordCount;
//     });

//     return {
//         acceptedKeywordCount,
//         rejectedKeywordCount
//     };
// };

export const applyToJob = async (req, res, next) => {
    const { jobId } = req.params
    const {
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        portofolio,
        linkedIn
    } = req.body
    if (!firstName || !lastName || !email || !phoneNumber || !address) {
        return next(new Error('Please Enter All Required Fields', { cause: 400 }))
    }
    // console.log(req.body);

    const job = await jobOfferModel.findById(jobId)
    if (!job) {
        return next(new Error('No Jo Found', { cause: 400 }))
    }
    if (!req.file) {
        return next(new Error('Please Upload Your Resume', { cause: 400 }))
    }
    //filter req.file with keyWords
    // const keywordResult = await filterResumeByKeywords(req.file.buffer, jobId);
    // console.log("Keyword Analysis:", keywordResult);
    const fileName = getFileNameWithoutExtension(req.file.originalname);
    const customId = `${fileName}_${nanoId()}`;
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
        { folder: `${process.env.PROJECT_FOLDER}/JobResumes/${job.jobTitle}/${customId}` }
    )
    const resume = { secure_url, public_id, customId }
    const jobApplicantObj = {
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        portofolio,
        linkedIn,
        jobId,
        resume
    }
    const jobApplicant = await jobApplicantModel.create(jobApplicantObj)
    res.status(200).json({ message: 'Done', jobApplicant })
}

export const getJobApplicants = async (req, res, next) => {
    const { jobId } = req.params
    const jobApplicants = await jobApplicantModel.find({ jobId }).select('-resume.public_id -resume.customId')
    res.status(200).json({ message: 'Done', jobApplicants })
}

export const deleteJobApplicant = async (req, res, next) => {
    const { jobApplicantId } = req.params
    const deletedJobApplicant = await jobApplicantModel.findByIdAndDelete( jobApplicantId )
    if(!deletedJobApplicant){
        return next(new Error('Failed to delete', { cause: 400 }))
    }
    res.status(200).json({ message: 'Done' })
}