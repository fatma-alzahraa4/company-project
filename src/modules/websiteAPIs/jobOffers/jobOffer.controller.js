import { projectModel } from "../../../../DB/models/projectModel.js";
import { paginationFunc } from "../../../utils/pagination.js";
import { getOrSetCache } from "../../../utils/redis.js";
import { jobOfferModel } from './../../../../DB/models/jobOfferModel.js';

export const getJobs = async (req, res, next) => {
    const { page, size } = req.query
    const { limit, skip } = paginationFunc({ page, size }); 
    const jobs = await getOrSetCache(`jobsWebsite`, async () => {
        const [jobs , jobsCount] = await Promise.all([
            jobOfferModel.find()
            .select('jobTitle address employmentType experienceYears jobDetails')
            .sort({ createdAt: -1 }),
            jobOfferModel.countDocuments(),
        ]) 
        const data = {projects:formattedProjects, projcetsCount}
        return data;
    });
    const projectsFromRedis = {...projects}
      const paginatedProjects = projectsFromRedis.projects.slice(skip,( +skip + +limit));

    res.json({message:"Done" ,projects:paginatedProjects, projcetsCount:projectsFromRedis.projcetsCount})
}

export const getProject = async (req, res, next) => {
    const { projectId } = req.params;
    const project = await projectModel.findById(projectId)
        .select('-mainImage.public_id -mainImage.customId -updatedAt -progressPercentage -projectFolder -__v')
        .populate([
            {
                path: 'images',
                select: 'image.secure_url image.alt -projectId'
            },
            {
                path: 'categoryId',
                select: 'name'
            },
            {
                path: 'clientId',
                select: 'companyName companyLink logo.secure_url logo.alt active'
            }
        ])
    const formattedImages = project.images.map(img => ({
        secure_url: img.image.secure_url,
        alt: img.image.alt
    }));

    const formattedProject = {
        ...project.toObject(),
        images: formattedImages
    }
    return res.status(200).json({ message: 'Done', project: formattedProject })
}
