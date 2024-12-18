import { customAlphabet } from 'nanoid';
import cloudinary from "../../utils/cloudinaryConfigrations.js";
import moment from 'moment';
import { projectModel } from '../../../DB/models/projectModel.js';
import { projectImageModel } from './../../../DB/models/projectImageModel.js';
import { clientRedis, getOrSetCache } from '../../utils/redis.js';
const nanoId = customAlphabet('abcdefghijklmnopqrstuvwxyz123456890', 5)

const getFileNameWithoutExtension = (filename) => {
    return filename.split('.').slice(0, -1).join('.');
};

export const addProject = async (req, res, next) => {
    const {
        name,
        clientId,
        projectLink,
        details,
        status,
        progressPercentage,
        categoryId,
        altImage,
        date,
        video
    } = req.body
    const progPercen = undefined;
    const requiredInputs = [
        'name',
        'clientId',
        'projectLink',
        'details',
        'altImage',
        'status',
        'date',
        'categoryId',
    ];
    requiredInputs.forEach(input => {
        if (!req.body[`${input}`]) {
            return next(new Error(`Missing required field: ${input}`, { cause: 400 }));
        }
    });
    if (status != 'Pending' && status != 'InProgress' && status != 'Completed') {
        return next(new Error('Please enter valid status', { cause: 400 }))
    }
    if (status == 'InProgress' && !progressPercentage) {
        return next(new Error('Please enter Progress Percentage', { cause: 400 }))
    }
    if (status == 'InProgress' && progressPercentage) {
        progPercen = progressPercentage;
    }
    if (!req.file) {
        return next(new Error('Please upload project image', { cause: 400 }))
    }
    const projectFolder = `${name}_${nanoId()}`
    const imageName = getFileNameWithoutExtension(req.file.originalname);
    const customId = `${imageName}_${nanoId()}`
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        folder: `${process.env.PROJECT_FOLDER}/Projects/${projectFolder}/mainImage/${customId}`
    });
    const projectObj = {
        name,
        clientId,
        projectLink,
        details,
        status,
        progressPercentage:
            status === "Pending" ? 0 :
                status === "Completed" ? 100 :
                    progPercen,
        projectFolder,
        categoryId,
        date,
        mainImage: { secure_url, public_id, alt: altImage, customId },
        video
    }
    const newProject = await projectModel.create(projectObj)
    if (!newProject) {
        return next(new Error('Failed to create project. Please try again.', { cause: 400 }));
    }

    clientRedis.del('homeData');
    clientRedis.del('projectsWebsite');
    clientRedis.del('projectsDashBoard');

    res.status(200).json({ message: 'Done', project: newProject })
}

export const editProject = async (req, res, next) => {
    const { projectId } = req.params;
    const {
        name,
        clientId,
        projectLink,
        details,
        status,
        progressPercentage,
        altImage,
        categoryId,
        date,
        video
    } = req.body
    const project = await projectModel.findById(projectId)
    if (!project) {
        return next(new Error('Project not found. Please verify the ID and try again.', { cause: 404 }));
    }
    let projectFolder = project.projectFolder
    if (name) {
        projectFolder = `${name}_${nanoId()}`
    }
    let project_Image;
    if (req.file) {
        const imageName = getFileNameWithoutExtension(req.file.originalname);
        const customId1 = `${imageName}_${nanoId()}`
        await cloudinary.uploader.destroy(project.mainImage.public_id)
        const [deletedFolder, { secure_url: secureUrl1, public_id: publicId1 }] = await Promise.all([
            cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Projects/${project.projectFolder}/mainImage/${project.mainImage.customId}`),
            cloudinary.uploader.upload(req.files['mainImage'][0].path, {
                folder: `${process.env.PROJECT_FOLDER}/Projects/${projectFolder}/mainImage/${customId1}`
            })
        ])
        project_Image = { secure_url: secureUrl1, public_id: publicId1, customId: customId1 }
    }
    else {
        const secure_url1 = project.mainImage.secure_url
        const public_id1 = project.mainImage.public_id
        const customId1 = project.mainImage.customId
        project_Image = { secure_url: secure_url1, public_id: public_id1, customId: customId1 }
    }

    if (status && status == 'InProgress' && !project.progressPercentage && !progressPercentage) {
        return next(new Error('Please enter Progress Percentage', { cause: 400 }))
    }
    else if (status && status != 'InProgress') {
        project.progressPercentage = undefined;
    }
    else if (project.status == 'InProgress' || (status && status == 'InProgress')) {
        project.progressPercentage = progressPercentage || project.progressPercentage;
    }
    project_Image.alt = altImage || project.mainImage.alt;
    project.name = name || project.name
    project.clientId = clientId || project.clientId
    project.projectLink = projectLink || project.projectLink
    project.details = details || project.details;
    project.status = status || project.status;
    project.categoryId = categoryId || project.categoryId;
    project.date = date || project.date;
    project.video = video || project.video;
    project.projectFolder = projectFolder;

    project.mainImage = { ...project_Image }

    const updatedProject = await project.save()
    if (!updatedProject) {
        await cloudinary.uploader.destroy(project_Image.public_id)
        await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Projects/${project_Image.customId}`)
        return next(new Error('Failed to update project. Please try again later.', { cause: 400 }));
    }

    clientRedis.del('homeData');
    clientRedis.del('projectsWebsite');
    clientRedis.del('projectsDashBoard');

    res.status(200).json({ message: 'Done', project: updatedProject })
}

export const addProjectImages = async (req, res, next) => {
    const { projectId, altImage } = req.body;
    const requiredInputs = [
        'projectId',
        'altImage',
    ];
    requiredInputs.forEach(input => {
        if (!req.body[`${input}`]) {
            return next(new Error(`Missing required field: ${input}`, { cause: 400 }));
        }
    });
    const project = await projectModel.findById(projectId)
    if (!project) {
        return next(new Error('Project not found. Please verify the ID and try again.', { cause: 404 }));
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

    clientRedis.del('homeData');
    clientRedis.del('projectsWebsite');
    clientRedis.del('projectsDashBoard');

    res.status(200).json({ message: 'Done', projectImages: savedImages });
}

export const deleteProjectImage = async (req, res, next) => {
    const { imageId } = req.params;
    const deletedImage = await projectImageModel.findByIdAndDelete(imageId).populate('projectId')
    if (!deletedImage) {
        return next(new Error('Failed to delete project image. project image not exist.', { cause: 400 }))
    }
    await cloudinary.uploader.destroy(deletedImage.image.public_id)
    await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Projects/${deletedImage.projectId.projectFolder}/Images/${deletedImage.image.customId}`)

    clientRedis.del('homeData');
    clientRedis.del('projectsWebsite');
    clientRedis.del('projectsDashBoard');

    res.status(200).json({ message: 'Done' })

}

export const deleteProject = async (req, res, next) => {
    const { projectId } = req.params;
    const deletedProject = await projectModel.findByIdAndDelete(projectId)
    if (!deletedProject) {
        return next(new Error('failed to delete', { cause: 400 }))
    }
    const [projectImages] = await Promise.all([
        projectImageModel.find({ projectId }),
    ])
    const projectImagesPublicIds = projectImages.map(p => p.image.public_id)
    const projectImagesIds = projectImages.map(p => p._id)
    if (projectImagesIds.length > 0) {
        const [deletedCloudImages, deletedDataBase] = await Promise.all([
            cloudinary.api.delete_resources(projectImagesPublicIds),
            projectImageModel.deleteMany({ _id: { $in: projectImagesIds } })
        ])
        if (!deletedCloudImages || deletedDataBase.deletedCount <= 0) {
            return next(new Error('failed to delete images', { cause: 400 }))
        }
    }

    const [ deletedMainImage] = await Promise.all([
        cloudinary.uploader.destroy(deletedProject.mainImage.public_id)
    ])
    const deletedFolder = await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Projects/${deletedProject.projectFolder}`)
    if (!deletedMainImage || !deletedFolder) {
        return next(new Error('Failed to delete main image and folder. Try again later', { cause: 400 }))
    }

    clientRedis.del('homeData');
    clientRedis.del('projectsWebsite');
    clientRedis.del('projectsDashBoard');

    res.status(200).json({ message: 'Done' })
}

export const getProjects = async (req, res, next) => {
    const projects = await getOrSetCache('projectsDashBoard', async () => {
        const projects = await projectModel.find().populate([
            {
                path: 'images',
                select: 'image.secure_url image.alt'
            },
            {
                path: 'categoryId',
                select: 'name active'
            },
            {
                path: 'clientId',
                select: 'companyName active'
            }
        ])
        const data = { projects }
        return data;
    })
    return res.status(200).json({ message: 'Done', ...projects })
}

export const getProject = async (req, res, next) => {
    const { projectId } = req.params;
    const project = await projectModel.findById(projectId).populate([
        {
            path: 'images',
            select: 'image.secure_url image.alt'
        },
        {
            path: 'categoryId',
            select: 'name brief active'
        },
        {
            path: 'clientId',
            select: 'companyName companyLink logo.secure_url logo.alt active'
        }
    ])
    return res.status(200).json({ message: 'Done', project })
}

