import { customAlphabet } from 'nanoid';
import cloudinary from "../../utils/cloudinaryConfigrations.js";
import moment from 'moment';
import { projectModel } from '../../../DB/models/projectModel.js';
import { projectImageModel } from './../../../DB/models/projectImageModel.js';
import { projectVideoModel } from '../../../DB/models/projectVideoModel.js';
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
    const progPercen = undefined;
    if (!name || !clientName || !projectLink || !details || !altImage || !status) {
        return next(new Error('Please enter all required data', { cause: 400 }))
    }
    if(status != 'Pending' && status != 'InProgress' && status != 'Completed'){
        return next(new Error('Please enter valid status', { cause: 400 }))
    }
    if(status == 'InProgress' && !progressPercentage){
        return next(new Error('Please enter Progress Percentage', { cause: 400 }))
    }
    if(status == 'InProgress' && progressPercentage ){
        progPercen = progressPercentage;
        // return next(new Error('Progress Percentage should only be provided when the status is InProgress', { cause: 400 }));
    }
    if (!req.file) {
        return next(new Error('Please upload project image', { cause: 400 }));
    }
    const projectFolder = `${name}_${nanoId()}`
    const imageName = getFileNameWithoutExtension(req.file.originalname);
    const customId = `${imageName}_${nanoId()}`
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.PROJECT_FOLDER}/Projects/${projectFolder}/mainImage/${customId}`
    });
    const projectObj = {
        name,
        clientName,
        projectLink,
        clientLink,
        details,
        status,
        progressPercentage:progPercen,
        projectFolder,
        mainImage: { secure_url, public_id, alt: altImage, customId },
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
    let projectFolder = project.projectFolder
    if (name) {
        projectFolder = `${name}_${nanoId()}`
    }
    let project_Image
    if (req.file) {
        const imageName = getFileNameWithoutExtension(req.file.originalname);
        const customId = `${imageName}_${nanoId()}`
        await cloudinary.uploader.destroy(project.mainImage.public_id)
        const [deletedFolder, { secure_url, public_id }] = await Promise.all([
            cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Projects/${project.projectFolder}/mainImage/${project.mainImage.customId}`),
            cloudinary.uploader.upload(req.file.path, {
                folder: `${process.env.PROJECT_FOLDER}/Projects/${projectFolder}/mainImage/${customId}`
            })
        ])
        project_Image = { secure_url, public_id, customId }
    }
    else {
        const secure_url = project.mainImage.secure_url
        const public_id = project.mainImage.public_id
        const customId = project.mainImage.customId
        project_Image = { secure_url, public_id, customId }
    }
    if(status && status == 'InProgress' && !project.progressPercentage && !progressPercentage){
        return next(new Error('Please enter Progress Percentage', { cause: 400 }))
    }
    else if(status && status != 'InProgress' ){
        project.progressPercentage = undefined;
        // return next(new Error('Progress Percentage should only be provided when the status is InProgress', { cause: 400 }));
    }
    else if(project.status == 'InProgress' || (status &&  status == 'InProgress' )){
    project.progressPercentage = progressPercentage || project.progressPercentage;
    }
    project_Image.alt = altImage || project.mainImage.alt
    project.name = name || project.name
    project.clientName = clientName || project.clientName
    project.projectLink = projectLink || project.projectLink
    project.clientLink = clientLink || project.clientLink
    project.details = details || project.details;
    project.status = status || project.status;
    project.projectFolder = projectFolder

    project.mainImage = { ...project_Image }

    const updatedProject = await project.save()
    if (!updatedProject) {
        await cloudinary.uploader.destroy(project_Image.public_id)
        await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Projects/${project_Image.customId}`)
        return next(new Error('update failed', { cause: 400 }))
    }
    res.status(200).json({ message: 'Done', project: updatedProject })
}

export const addProjectImages = async (req, res, next) => {
    const { projectId, altImage } = req.body;
    if (!projectId) {
        return next(new Error('project id is required', { cause: 400 }))
    }
    const project = await projectModel.findById(projectId)
    if (!project) {
        return next(new Error('no project found', { cause: 400 }))
    }
    if (!req.files || req.files.length === 0) {
        return next(new Error('Please upload at least one project image', { cause: 400 }));
    }    
    const uploadPromises = req.files['images'].map(async (file) => {
        const imageName = getFileNameWithoutExtension(file.originalname);
        const customId = `${imageName}_${nanoId()}`;
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
            folder: `${process.env.PROJECT_FOLDER}/Projects/${project.projectFolder}/Images/${customId}`,
        });

        // Return the image data to be inserted later
        return {
            image: {
                secure_url,
                public_id,
                alt: altImage || imageName,
                customId,
            },
            projectId,
        };
    });
    const uploadedImagesData = await Promise.all(uploadPromises);
    const savedImages = await projectImageModel.insertMany(uploadedImagesData);
    
    res.status(200).json({ message: 'Done',projectImages: savedImages});
}

export const deleteProjectImage = async (req,res,next) =>{
    const { imageId } = req.params;
    const deletedImage = await projectImageModel.findByIdAndDelete(imageId).populate('projectId')
    if (!deletedImage) {
        return next(new Error('failed to delete', { cause: 400 }))
    }
    await cloudinary.uploader.destroy(deletedImage.image.public_id)
    await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Projects/${deletedImage.projectId.projectFolder}/Images/${deletedImage.image.customId}`)
    return res.status(200).json({ message: 'Done' })

}

export const addProjectVideos = async (req, res, next) => {
    const { projectId } = req.body;
    if (!projectId) {
        return next(new Error('project id is required', { cause: 400 }))
    }
    const project = await projectModel.findById(projectId)
    if (!project) {
        return next(new Error('no project found', { cause: 400 }))
    }
    if (!req.files || req.files.length === 0) {
        return next(new Error('Please upload at least one project Video', { cause: 400 }));
    }
    const uploadPromises = req.files['videos'].map(async (file) => {
        const videoName = getFileNameWithoutExtension(file.originalname);
        const customId = `${videoName}_${nanoId()}`;
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
            resource_type: 'video',
            folder: `${process.env.PROJECT_FOLDER}/Projects/${project.projectFolder}/Videos/${customId}`,
        });

        // Return the video data to be inserted later
        return {
            video: {
                secure_url,
                public_id,
                customId,
            },
            projectId,
        };
    });
    const uploadedVideosData = await Promise.all(uploadPromises);
    const savedVideos = await projectVideoModel.insertMany(uploadedVideosData);
    
    res.status(200).json({ message: 'Done',projectVideos: savedVideos});
}

export const deleteProjectVideo = async (req,res,next) =>{
    const { videoId } = req.params;
    const deletedVideo = await projectVideoModel.findByIdAndDelete(videoId).populate('projectId')
    if (!deletedVideo) {
        return next(new Error('failed to delete', { cause: 400 }))
    }
    await cloudinary.uploader.destroy(deletedVideo.video.public_id,{ resource_type: 'video' })
    await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Projects/${deletedVideo.projectId.projectFolder}/Videos/${deletedVideo.video.customId}`)
    return res.status(200).json({ message: 'Done' })

}

export const deleteProject = async (req, res, next) => {
    const { projectId } = req.params;
    const deletedProject = await projectModel.findByIdAndDelete(projectId)
    if (!deletedProject) {
        return next(new Error('failed to delete', { cause: 400 }))
    }
    const [projectImages,projectVideos] = await Promise.all([
        projectImageModel.find({projectId}),
        projectVideoModel.find({projectId})
    ])
    const projectImagesPublicIds = projectImages.map(p=>p.image.public_id)
    const projectImagesIds = projectImages.map(p=>p._id)
    const projectVideosPublicIds = projectVideos.map(p=>p.video.public_id)
    const projectVideosIds = projectVideos.map(p=>p._id)
    if (projectImagesIds.length > 0) {
        const [deletedCloudImages, deletedDataBase ] =await Promise.all([
            cloudinary.api.delete_resources(projectImagesPublicIds),
            projectImageModel.deleteMany({ _id: { $in: projectImagesIds } })
        ])
        if(!deletedCloudImages || deletedDataBase.deletedCount <= 0){
        return next(new Error('failed to delete images', { cause: 400 }))
        }
    }
    if (projectVideosIds.length > 0) {
        const [deletedCloudVideos, deletedDataBase ] =await Promise.all([
            cloudinary.api.delete_resources(projectVideosPublicIds,{ resource_type: 'video' }),
            projectVideoModel.deleteMany({ _id: { $in: projectVideosIds } })
        ])
        if(!deletedCloudVideos || deletedDataBase.deletedCount <= 0){
            return next(new Error('failed to delete Videos', { cause: 400 }))
            }

    }
    const deletedMainImage = await cloudinary.uploader.destroy(deletedProject.mainImage.public_id)
    const deletedFolder = await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Projects/${deletedProject.projectFolder}`)
    if(!deletedMainImage || !deletedFolder){
        return next(new Error('failed to delete main image and folder', { cause: 400 }))
    }
    return res.status(200).json({ message: 'Done' })
}

export const getProjects = async (req, res, next) => {
    const projects = await projectModel.find().populate([
        {
            path:'images',
            select:'image.secure_url image.alt'
        },
        {
            path:'videos',
            select:'video.secure_url'
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
            path:'videos',
            select:'video.secure_url'
        }
    ])
    return res.status(200).json({ message: 'Done', project })
}

