import { projectModel } from "../../../../DB/models/projectModel.js";
import { serviceModel } from "../../../../DB/models/serviceModel.js";
import { paginationFunc } from "../../../utils/pagination.js";
import { getOrSetCache } from "../../../utils/redis.js";

export const getProjects = async (req, res, next) => {
    // const { page, size } = req.query
    // const { limit, skip } = paginationFunc({ page, size });
    const projects = await getOrSetCache(`projectsWebsite`, async () => {
        const [projects, projcetsCount, categories] = await Promise.all([
            projectModel.find()
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
                .sort({ date: -1, createdAt: -1 }),
            projectModel.countDocuments(),

            serviceModel.aggregate([
                {
                    $lookup: {
                        from: "projects", // MongoDB will automatically use the lowercase plural name of the collection
                        localField: "_id",
                        foreignField: "categoryId",
                        as: "projects"
                    }
                },
                {
                    $match: {
                        active: true, // Ensure services are active
                        projects: { $ne: [] } // Filter out services with no projects
                    }
                },
                {
                    $project: {
                        name: 1 // Only include the 'name' field in the output
                    }
                }
            ]),
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
        const data = { projects: formattedProjects, projcetsCount, categories }
        return data;
    });
    const projectsFromRedis = { ...projects }
    // const paginatedProjects = projectsFromRedis.projects.slice(skip, (+skip + +limit));

    res.json({ message: "Done", projects: projectsFromRedis.projects, projcetsCount: projectsFromRedis.projcetsCount, categories: projectsFromRedis.categories })
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
