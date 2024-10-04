import joi from "joi"
import { generalFields } from "../../middlewares/validation.js"
export const addTeamSchema ={
    body:joi.object({
        name:joi.string().min(3).required(),
        position:joi.string().min(3).required(),
        qoute:joi.string().min(3),
        alt:joi.string().min(3).required(),  
    }).required()
}

export const editTeamSchema ={
    params:joi.object({
        memberId:generalFields._id.required()
    }).required(),
    body:joi.object({
        name:joi.string().min(3),
        position:joi.string().min(3),
        qoute:joi.string().min(3),
        alt:joi.string().min(3),  
    }).required()
}

export const deleteTeamSchema ={
    params:joi.object({
        memberId:generalFields._id.required()
    }).required(),
}

export const getTeamSchema ={
    query:joi.object({
        notActive:joi.string().min(4).valid('true')
    }).required(),
}