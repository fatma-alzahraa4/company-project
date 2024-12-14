import { projectModel } from "../../../../DB/models/projectModel.js";
import { paginationFunc } from "../../../utils/pagination.js";
import { getOrSetCache } from "../../../utils/redis.js";
import { jobOfferModel } from './../../../../DB/models/jobOfferModel.js';

export const getJobs = async (req, res, next) => {
    const { page, size } = req.query
    const { limit, skip } = paginationFunc({ page, size });
    const jobs = await getOrSetCache(`jobsWebsite`, async () => {
        const [jobs, jobsCount] = await Promise.all([
            jobOfferModel.aggregate([
                {
                    $lookup: {
                        from: 'job_applicants', // The name of the job applicants collection
                        localField: '_id',
                        foreignField: 'jobId',
                        as: 'applicants',
                    },
                },
                {
                    $addFields: {
                        applicantsCount: { $size: '$applicants' },
                    },
                },
                {
                    $project: {
                        jobTitle: 1,
                        address: 1,
                        employmentType: 1,
                        experienceYears: 1,
                        jobDetails: 1,
                        applicantsCount: 1,
                    },
                },
                {
                    $sort: { createdAt: -1 },
                },
            ]),
            jobOfferModel.countDocuments(),
        ])
        const data = { jobs, jobsCount }
        return data;
    });
    const jobsFromRedis = { ...jobs }
    const paginatedJobs = jobsFromRedis.jobs.slice(skip, (+skip + +limit));

    res.json({ message: "Done", jobs: paginatedJobs, jobsCount: jobsFromRedis.jobsCount })
}

export const getJob = async (req, res, next) => {
    const { jobId } = req.params;
    const job = await jobOfferModel.findById(jobId)
        .select('jobTitle address employmentType experienceYears jobDetails')

    return res.status(200).json({ message: 'Done', job })
}
