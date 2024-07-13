import { serviceModel } from "../../../DB/models/serviceModel.js"
import { customAlphabet } from 'nanoid';
import cloudinary from "../../utils/cloudinaryConfigrations.js";
import { mainServiceModel } from "../../../DB/models/mainServiceModel.js";
const nanoId = customAlphabet('abcdefghijklmnopqrstuvwxyz123456890', 5)
const getFileNameWithoutExtension = (filename) => {
    return filename.split('.').slice(0, -1).join('.');
};

export const addMainServiceData = async (req, res, next) => {
    const { name, alt } = req.body
    if (!name) {
        return next(new Error('Please enter a name for main service', { cause: 400 }))
    }
    const fileName = getFileNameWithoutExtension(req.file.originalname);
    const customId = `${fileName}_${nanoId()}`;
    if (!req.file) {
        return next(new Error('Please upload icon for main service', { cause: 400 }))
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
        { folder: `${process.env.PROJECT_FOLDER}/mainService/${customId}` }
    )
    req.imagePath = `${process.env.PROJECT_FOLDER}/mainService/${customId}`

    const mainServiceObj = {
        name,
        icon: { secure_url, public_id, alt },
        customId
    }
    const newMainService = await mainServiceModel.create(mainServiceObj)
    if (!newMainService) {
        return next(new Error('creation failed', { cause: 400 }))
    }
    res.status(200).json({ message: 'Done', newMainService })

}

export const editMainService = async (req, res, next) => {
    const { mainServiceId } = req.params
    const { name, alt } = req.body
    const mainService = await mainServiceModel.findById(mainServiceId)
    if (!mainService) {
        return next(new Error('no main service exist', { cause: 400 }))
    }

    const customId = nanoId()
    let mainService_icon
    if (req.file) {
        const fileName = getFileNameWithoutExtension(req.file.originalname);
        const customId = `${fileName}_${nanoId()}`;

        await cloudinary.uploader.destroy(mainService.icon.public_id)
        await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/mainService/${mainService.customId}`)
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
            { folder: `${process.env.PROJECT_FOLDER}/mainService/${customId}` }
        )
        mainService_icon = { secure_url, public_id }
        mainService.customId = customId
        req.imagePath = `${process.env.PROJECT_FOLDER}/mainService/${customId}`
    }
    else {
        const secure_url = mainService.icon.secure_url;
        const public_id = mainService.icon.public_id
        mainService_icon = { secure_url, public_id }
        mainService.customId = mainService.customId
    }
    if (!name) {
        mainService.name = mainService.name
    }
    else {
        mainService.name = name
    }
    if (!alt) {
        mainService.icon = { ...mainService_icon, alt: mainService.icon.alt }
    }
    else {
        mainService.icon = { ...mainService_icon, alt }
    }


    const updatedMainService = await mainService.save()
    if (!updatedMainService) {
        await cloudinary.uploader.destroy(public_id)
        await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/mainService/${customId}`)
        return next(new Error('update failed', { cause: 400 }))

    }
    res.status(200).json({ message: 'Done', updatedMainService })
}

export const deleteMainService = async (req, res, next) => {
    const { mainServiceId } = req.params
    const deletedMainService = await mainServiceModel.findByIdAndDelete(mainServiceId)
    if (!deletedMainService) {
        return next(new Error('failed to delete', { cause: 400 }))
    }
    await cloudinary.uploader.destroy(deletedMainService.icon.public_id)
    await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/mainService/${deletedMainService.customId}`)
    return res.status(200).json({ message: 'Done', deletedMainService })

}

export const getMainServices = async (req, res, next) => {
    const mainServices = await mainServiceModel.find().populate([
        {
            path: 'services',
            populate:[{
                path:'subServices',
            }]
        }])

    if (!mainServices) {
        return next(new Error('failed to get main services', { cause: 400 }))
    }
    return res.status(200).json({ message: 'Done', mainServices })
}