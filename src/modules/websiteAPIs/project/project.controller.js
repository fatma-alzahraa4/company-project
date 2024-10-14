import { projectModel } from "../../../../DB/models/projectModel.js";

export const getProjects = async (req, res, next) => {
    const projects = await projectModel.find().populate([
        {
            path:'images',
            select:'image.secure_url image.alt'
        },
        {
            path:'categoryId',
            select:'name brief active'
        }
    ])
    return res.status(200).json({ message: 'Done', projects })
}

export const getProject = async (req, res, next) => {
    const { projectId } = req.params;
    const project = await projectModel.findById(projectId).populate([
        {
            path:'images',
            select:'image.secure_url image.alt'
        },
        {
            path:'categoryId',
            select:'name brief active'
        }
    ])
    return res.status(200).json({ message: 'Done', project })
}