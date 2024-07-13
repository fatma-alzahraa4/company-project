import joi from "joi"
import { generalFields } from "../../middlewares/validation.js"
export const addMainServiceSchema ={
    body:joi.object({
        name:joi.string().min(3).max(30).required(),
        alt:joi.string().min(3).max(100).required(),  
    }).required()
}

export const editMainServiceSchema ={
    params:joi.object({
        mainServiceId:generalFields._id.required()
    }).required(),
    body:joi.object({
        name:joi.string().min(3).max(30),
        alt:joi.string().min(3).max(100),  
    }).required()
}

export const deleteMainServiceSchema ={
    params:joi.object({
        mainServiceId:generalFields._id.required()
    }).required(),
}