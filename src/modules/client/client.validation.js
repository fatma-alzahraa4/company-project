import joi from "joi"
import { generalFields } from "../../middleWares/validation.js"
export const addClientSchema ={
    body:joi.object({
        companyName:joi.string().min(3).required(),
        companyLink:joi.string().uri(),
        details:joi.string().min(3),
        isExpertise:joi.boolean(),
        teamId:joi.array().items(generalFields._id),
        altImage:joi.string().min(3).required(),
    }).required()
}

export const editClientSchema ={
    params:joi.object({
        clientId:generalFields._id.required()
    }).required(),
    body:joi.object({
        companyName:joi.string().min(3),
        companyLink:joi.string().uri(),
        details:joi.string().min(3),
        isExpertise:joi.boolean(),
        teamId:joi.array().items(generalFields._id),
        altImage:joi.string().min(3),
    }).required()
}

export const deleteClientSchema ={
    params:joi.object({
        clientId:generalFields._id.required()
    }).required(),
}

export const getClientSchema ={
    query:joi.object({
        notActive:joi.string().min(4).valid('true')
    }).required(),
}