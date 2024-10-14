import { projectModel } from "../../../../DB/models/projectModel.js";

export const getProjects = async (req, res, next) => {
    const projects = await projectModel.find()
    .select('-mainImage.public_id -mainImage.customId -updatedAt -progressPercentage -projectFolder -video.customId -video.public_id -__v')
    .populate([
        {
            path:'images',
            select:'image.secure_url image.alt -projectId'
        },
        {
            path:'categoryId',
            select:'name'
        }
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
    return res.status(200).json({ message: 'Done', projects:formattedProjects })
}

export const getProject = async (req, res, next) => {
    const { projectId } = req.params;
    const project = await projectModel.findById(projectId)
    .select('-mainImage.public_id -mainImage.customId -updatedAt -progressPercentage -projectFolder -video.customId -video.public_id -__v')
    .populate([
        {
            path:'images',
            select:'image.secure_url image.alt -projectId'
        },
        {
            path:'categoryId',
            select:'name'
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
    return res.status(200).json({ message: 'Done', project:formattedProject })
}