import joi from "joi"
import { generalFields } from "../../middleWares/validation.js"
export const addMainServiceSchema ={
    body:joi.object({
        name:joi.string().min(3).max(30).required(),
    }).required()
}

export const editMainServiceSchema ={
    params:joi.object({
        mainServiceId:generalFields._id.required()
    }).required(),
    body:joi.object({
        name:joi.string().min(3).max(30),
    }).required()
}

export const deleteMainServiceSchema ={
    params:joi.object({
        mainServiceId:generalFields._id.required()
    }).required(),
}

export const getMainServiceSchema ={
    query:joi.object({
        notActive:joi.string().min(4).max(4).valid('true')
    }).required(),
}