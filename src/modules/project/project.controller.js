import { customAlphabet } from 'nanoid';
import cloudinary from "../../utils/cloudinaryConfigrations.js";
import moment from 'moment';
import { projectModel } from '../../../DB/models/projectModel.js';
const nanoId = customAlphabet('abcdefghijklmnopqrstuvwxyz123456890', 5)

const getFileNameWithoutExtension = (filename) => {
    return filename.split('.').slice(0, -1).join('.');
};

export const addProject = async (req, res, next) => {
    const {
        name,
        clientName,
        projectLink,
        clientLink,
        details,
        status,
        progressPercentage,
        altImage,
    } = req.body
    if (!name || !clientName || !projectLink || !details || !altImage || !status) {
        return next(new Error('Please enter all required data', { cause: 400 }))
    }
    if(status != 'Pending' && status != 'InProgress' && status != 'Completed'){
        return next(new Error('Please enter valid status', { cause: 400 }))
    }
    if(status == 'InProgress' && !progressPercentage){
        return next(new Error('Please enter Progress Percentage', { cause: 400 }))
    }
    if (!req.file) {
        return next(new Error('Please upload project image', { cause: 400 }));
    }
    const imageName = getFileNameWithoutExtension(req.file.originalname);
    const customId = `${imageName}_${nanoId()}`
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.PROJECT_FOLDER}/Projects/${customId}`
    });
    const projectObj = {
        name,
        clientName,
        projectLink,
        clientLink,
        details,
        status,
        progressPercentage,
        image: { secure_url, public_id, alt: altImage, customId },
    }
    const newProject = await projectModel.create(projectObj)
    if (!newProject) {
        return next(new Error('creation failed', { cause: 400 }))
    }
    res.status(200).json({ message: 'Done', project: newProject })
}

export const editProject = async (req, res, next) => {
    const { projectId } = req.params;
    const {
        name,
        clientName,
        projectLink,
        clientLink,
        details,
        status,
        progressPercentage,
        altImage,
    } = req.body
    const project = await projectModel.findById(projectId)
    if (!project) {
        return next(new Error('no project exist', { cause: 400 }))
    }

    let project_Image
    if (req.file) {
        const imageName = getFileNameWithoutExtension(req.file.originalname);
        const customId = `${imageName}_${nanoId()}`
        await cloudinary.uploader.destroy(project.image.public_id)
        const [deletedFolder, { secure_url, public_id }] = await Promise.all([
            cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Projects/${project.image.customId}`),
            cloudinary.uploader.upload(req.file.path, {
                folder: `${process.env.PROJECT_FOLDER}/Projects/${customId}}`
            })
        ])
        project_Image = { secure_url, public_id, customId }
    }
    else {
        const secure_url = project.image.secure_url
        const public_id = project.image.public_id
        const customId = project.image.customId
        project_Image = { secure_url, public_id, customId }
    }
    project_Image.alt = altImage || project.alt
    project.name = name || project.name
    project.clientName = clientName || project.clientName
    project.projectLink = projectLink || project.projectLink
    project.clientLink = clientLink || project.clientLink
    project.details = details || project.details;
    project.status = status || project.status;
    project.progressPercentage = progressPercentage || project.progressPercentage;


    project.image = { ...project_Image }

    const updatedProject = await project.save()
    if (!updatedProject) {
        await cloudinary.uploader.destroy(project_Image.public_id)
        await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Projects/${project_Image.customId}`)
        return next(new Error('update failed', { cause: 400 }))
    }
    res.status(200).json({ message: 'Done', project: updatedProject })
}

export const deleteProject = async (req, res, next) => {
    const { projectId } = req.params;
    const deletedProject = await projectModel.findByIdAndDelete(projectId)
    if (!deletedProject) {
        return next(new Error('failed to delete', { cause: 400 }))
    }
    const deletedImage = await cloudinary.uploader.destroy(deletedProject.image.public_id)
    const deletedFolder = await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Projects/${deletedProject.image.customId}`)
    if (!deletedImage || !deletedFolder) {
        return next(new Error('failed to delete main image and folder', { cause: 400 }))
    }
    return res.status(200).json({ message: 'Done' })
}

export const getProjects = async (req, res, next) => {
    const projects = await projectModel.find()
    return res.status(200).json({ message: 'Done', projects })
}

export const getProject = async (req, res, next) => {
    const { projectId } = req.params;
    const project = await projectModel.findById(projectId)
    return res.status(200).json({ message: 'Done', project })
}

