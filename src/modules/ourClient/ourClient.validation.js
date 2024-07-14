import joi from "joi"
import { generalFields } from "../../middleWares/validation.js"
export const addClientSchema ={
    body:joi.object({
        companyName:joi.string().min(3).max(25).required(),
        details:joi.string().min(3).max(500),
        teamId:joi.array().items(generalFields._id),
        altImage:joi.string().min(3).max(100).required(),  
        altVideo:joi.string().min(3).max(100).required(), 
    }).required()
}

export const editClientSchema ={
    params:joi.object({
        clientId:generalFields._id.required()
    }).required(),
    body:joi.object({
        companyName:joi.string().min(3).max(25),
        details:joi.string().min(3).max(500),
        teamId:joi.array().items(generalFields._id),
        altImage:joi.string().min(3).max(100),  
        altVideo:joi.string().min(3).max(100), 
    }).required()
}

export const deleteClientSchema ={
    params:joi.object({
        clientId:generalFields._id.required()
    }).required(),
}

export const getClientSchema ={
    query:joi.object({
        notActive:joi.string().min(4).max(4).valid('true')
    }).required(),
}