import { projectModel } from "../../../../DB/models/projectModel.js";
import { paginationFunc } from "../../../utils/pagination.js";
import { getOrSetCache } from "../../../utils/redis.js";

export const getProjects = async (req, res, next) => {
    const { page, size } = req.query
    const { limit, skip } = paginationFunc({ page, size }); 
    const projects = await getOrSetCache(`projectsWebsite`, async () => {
        const [projects , projcetsCount] = await Promise.all([
            projectModel.find()
            .select('-mainImage.public_id -mainImage.customId -updatedAt -progressPercentage -projectFolder -video.customId -video.public_id -__v')
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
            .sort({ date: -1, createdAt: -1 }),
            projectModel.countDocuments(),
        ]) 
        const formattedProjects = projects.map(project => {
            const formattedImages = project.images.map(img => ({
                secure_url: img.image.secure_url,
                alt: img.image.alt
            }));
    
            return {
                ...project.toObject(),
                images: formattedImages
            };
        })
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
        .select('-mainImage.public_id -mainImage.customId -updatedAt -progressPercentage -projectFolder -video.customId -video.public_id -__v')
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
