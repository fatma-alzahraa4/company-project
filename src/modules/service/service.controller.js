import { serviceModel } from "../../../DB/models/serviceModel.js"
import { customAlphabet } from 'nanoid';
import cloudinary from "../../utils/cloudinaryConfigrations.js";
import { mainServiceModel } from "../../../DB/models/mainServiceModel.js";
// const nanoId = customAlphabet('abcdefghijklmnopqrstuvwxyz123456890', 5)
// const getFileNameWithoutExtension = (filename) => {
//     return filename.split('.').slice(0, -1).join('.');
// };


export const addServiceData = async (req, res, next) => {
    const { name, mainServiceId } = req.body
    console.log(name,mainServiceId);
    if (!name) {
        return next(new Error('Please enter a name for service', { cause: 400 }))
    }
    const isMainServiceExist = await mainServiceModel.findById(mainServiceId)
        if (!isMainServiceExist) {
            return next(new Error('no main service exist', { cause: 400 }))
        }
    // const fileName = getFileNameWithoutExtension(req.file.originalname);
    // const customId = `${fileName}_${nanoId()}`;
    // if (!req.file) {
    //     return next(new Error('Please upload icon for service', { cause: 400 }))
    // }
    // const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
    //     { folder: `${process.env.PROJECT_FOLDER}/service/${customId}` }
    // )
    // req.imagePath = `${process.env.PROJECT_FOLDER}/service/${customId}`

    const serviceObj = {
        name,
        mainServiceId
        // icon: { secure_url, public_id, alt },
        // customId
    }
    const newService = await serviceModel.create(serviceObj)
    if (!newService) {
        return next(new Error('creation failed', { cause: 400 }))
    }
    res.status(200).json({ message: 'Done', newService })

}

export const editService = async (req, res, next) => {
    const { serviceId } = req.params
    const { name, mainServiceId } = req.body
    const service = await serviceModel.findById(serviceId)
    if (!service) {
        return next(new Error('no service exist', { cause: 400 }))
    }
    if (mainServiceId) {
        const isMainServiceExist = await mainServiceModel.findById(mainServiceId)
        if (!isMainServiceExist) {
            return next(new Error('no main service exist', { cause: 400 }))
        }
        service.mainServiceId = mainServiceId
    }
    else {
        service.mainServiceId = service.mainServiceId
    }
    if (!name) {
        service.name = service.name
    }
    else {
        service.name = name
    }
    // const customId = nanoId()
    // let service_icon
    // if (req.file) {
    //     const fileName = getFileNameWithoutExtension(req.file.originalname);
    //     const customId = `${fileName}_${nanoId()}`;

    //     await cloudinary.uploader.destroy(service.icon.public_id)
    //     await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/service/${service.customId}`)
    //     const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
    //         { folder: `${process.env.PROJECT_FOLDER}/service/${customId}` }
    //     )
    //     service_icon = { secure_url, public_id }
    //     service.customId = customId
    //     req.imagePath = `${process.env.PROJECT_FOLDER}/service/${customId}`
    // }
    // else {
    //     const secure_url = service.icon.secure_url;
    //     const public_id = service.icon.public_id
    //     service_icon = { secure_url, public_id }
    //     service.customId = service.customId
    // }

    // if (!alt) {
    //     service.icon = { ...service_icon, alt: service.icon.alt }
    // }
    // else {
    //     service.icon = { ...service_icon, alt }
    // }


    const updatedService = await service.save()
    if (!updatedService) {
        // await cloudinary.uploader.destroy(public_id)
        // await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/service/${customId}`)
        return next(new Error('update failed', { cause: 400 }))

    }
    res.status(200).json({ message: 'Done', updatedService })
}

export const deleteService = async (req, res, next) => {
    const { serviceId } = req.params
    const deletedService = await serviceModel.findOneAndUpdate({_id:serviceId , active:true},{active:false},{new:true})
    if (!deletedService) {
        return next(new Error('failed to delete', { cause: 400 }))
    }
    // await cloudinary.uploader.destroy(deletedService.icon.public_id)
    // await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/service/${deletedService.customId}`)
    return res.status(200).json({ message: 'Done', deletedService })

}

export const getservices = async (req, res, next) => {
    const { notActive } = req.query
    if (!notActive) {
        const services = await serviceModel.find({active:true}).populate([
            {
                path: 'subServices',
            }])
    
        if (!services) {
            return next(new Error('failed to get services', { cause: 400 }))
        }
        return res.status(200).json({ message: 'Done', services })
    }
    else {
        if (notActive == 'true') {
            const services = await serviceModel.find().populate([
                {
                    path: 'subServices',
                }])
        
            if (!services) {
                return next(new Error('failed to get services', { cause: 400 }))
            }
            return res.status(200).json({ message: 'Done', services })
        }
        else {
            return next(new Error('wrong query', { cause: 400 }))
        }
    }
    
}