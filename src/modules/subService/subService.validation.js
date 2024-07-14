import joi from "joi"
import { generalFields } from "../../middleWares/validation.js"
export const addSubServiceSchema ={
    query:joi.object({
        serviceId:generalFields._id
    }).required(),
    body:joi.object({
        name:joi.string().min(3).max(30).required(),
        brief:joi.string().min(3).max(500),
    }).required()
}

export const editSubServiceSchema ={
    params:joi.object({
        subserviceId:generalFields._id.required()
    }).required(),
    body:joi.object({
        name:joi.string().min(3).max(30),
        brief:joi.string().min(3).max(500),
        serviceId:generalFields._id
    }).required()
}

export const deleteSubServiceSchema ={
    params:joi.object({
        subserviceId:generalFields._id.required()
    }).required(),
}

export const getSubServiceSchema ={
    query:joi.object({
        notActive:joi.string().min(4).max(4).valid('true')
    }).required(),
}