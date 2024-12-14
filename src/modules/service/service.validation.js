import joi from "joi"
import { generalFields } from "../../middleWares/validation.js"
export const addServiceSchema ={
    body:joi.object({
        name:joi.string().required(),
        brief:joi.string(),
        isHome:joi.boolean().default(false),
        altIcon:joi.string().required()
    }).required()
}

export const editServiceSchema ={
    params:joi.object({
        serviceId:generalFields._id.required()
    }).required(),
    body:joi.object({
        name:joi.string(),
        brief:joi.string(),
        isHome:joi.boolean().default(false),
        altIcon:joi.string()
    }).required()
}

export const deleteServiceSchema ={
    params:joi.object({
        serviceId:generalFields._id.required()
    }).required(),
}

export const getServiceSchema ={
    query:joi.object({
        notActive:joi.string().min(4).valid('true')
    }).required(),
}