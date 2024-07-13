import { serviceModel } from "../../../DB/models/serviceModel.js"
import cloudinary from "../../utils/cloudinaryConfigrations.js";
import { subServiceModel } from "../../../DB/models/subServiceModel.js";

export const addSubServiceData = async (req, res, next) => {
    const{serviceId} = req.query
    const {name,brief} = req.body
    if(serviceId){
        const service = await serviceModel.findById(serviceId)
        if(!service){
            return next(new Error('no service found', { cause: 400 }))
        }
    }
    if(!name){
        return next(new Error('Please enter a name for subService', { cause: 400 }))
    }
    
    const subServiceObj = {
        name,
        brief,
        serviceId
    }
    const newSubService = await subServiceModel.create(subServiceObj)
    if (!newSubService) {
        return next(new Error('creation failed', { cause: 400 }))
    }
    res.status(200).json({ message: 'Done', newSubService })

}

export const editSubService = async (req, res, next) => {
    const{subserviceId} = req.params
    const {name,brief,serviceId} = req.body
    const subService = await subServiceModel.findById(subserviceId)
    if(serviceId){
        const service = await serviceModel.findById(serviceId)
        if(!service){
            return next(new Error('no service found', { cause: 400 }))
        }
    }
    if(!subService){
        return next(new Error('no subService found', { cause: 400 }))
    }
    if(!name){
       subService.name = subService.name
    }
    else{
        subService.name = name
    }
    if(!brief){
        subService.brief = subService.brief
    }
    else{
        subService.brief = brief
    }
    if(serviceId){
        subService.serviceId = serviceId
    }

    const updatedSubService = await subService.save()
    if (!updatedSubService) {
        return next(new Error('update failed', { cause: 400 }))

    }
    res.status(200).json({ message: 'Done', updatedSubService })
}


export const deleteSubService = async (req, res, next) => {
    const { subserviceId } = req.params
    const deletedSubService = await subServiceModel.findByIdAndDelete(subserviceId)
    if (!deletedSubService) {
        return next(new Error('failed to delete', { cause: 400 }))
    }
    return res.status(200).json({ message: 'Done' ,deletedSubService})

} 

export const getSubServices = async (req,res,next) =>{
    const subServices = await subServiceModel.find()
    if(!subServices){
        return next(new Error('failed to get services', { cause: 400 }))
    }
    return res.status(200).json({ message: 'Done', subServices })
}