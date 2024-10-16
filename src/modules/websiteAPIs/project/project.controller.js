import { projectModel } from "../../../../DB/models/projectModel.js";
import { paginationFunc } from "../../../utils/pagination.js";
// import { clientRedis, getOrSetCache } from "../redis.js";

export const getProjects = async (req, res, next) => {
    const { page, size } = req.query
    const { limit, skip } = paginationFunc({ page, size }); 
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
            }
        ])
        .sort({ date: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
        projectModel.countDocuments(),
    ]) 
    const formattedProjects = projects.map(project => {
        const formattedImages = project.images.map(img => ({
            secure_url: img.image.secure_url,
            alt: img.image.alt
        }));

        return {
            ...project.toObject(),  // Convert the Mongoose document to a plain object
            images: formattedImages  // Replace the images array with the formatted one
        };
    });
    return res.status(200).json({ message: 'Done', projects: formattedProjects, projcetsCount })
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

//redis
// export const getByRedis = async (req,res,next)=>{
//     const projects = await getOrSetCache(`projects`, async () => {
//         const projects = await projectModel.find()
//         const data = {projects}
//         return data;
//     });
//     res.json({message:"Done" , projects})
// }