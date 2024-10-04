import joi from "joi"
import { generalFields } from "../../middleWares/validation.js"
export const addSubServiceSchema ={
   
    body:joi.object({
        serviceId:generalFields._id.required(),
        name:joi.string().min(3).required(),
        brief:joi.string(),
    }).required()
}

export const editSubServiceSchema ={
    params:joi.object({
        subserviceId:generalFields._id.required()
    }).required(),
    body:joi.object({
        name:joi.string().min(3),
        brief:joi.string(),
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
        notActive:joi.string().min(4).valid('true')
    }).required(),
}