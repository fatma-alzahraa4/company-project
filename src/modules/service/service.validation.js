import joi from "joi"
import { generalFields } from "../../middleWares/validation.js"
export const addServiceSchema ={
    body:joi.object({
        name:joi.string().min(3).max(30).required(),
        mainServiceId:generalFields._id.required(),
        // alt:joi.string().min(3).max(100).required(),  
    }).required()
}

export const editServiceSchema ={
    params:joi.object({
        serviceId:generalFields._id.required()
    }).required(),
    body:joi.object({
        name:joi.string().min(3).max(30),
        mainServiceId:generalFields._id,
        // alt:joi.string().min(3).max(100),  
    }).required()
}

export const deleteServiceSchema ={
    params:joi.object({
        serviceId:generalFields._id.required()
    }).required(),
}

export const getServiceSchema ={
    query:joi.object({
        notActive:joi.string().min(4).max(4).valid('true')
    }).required(),
}
