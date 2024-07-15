import joi from "joi"
import { generalFields } from "../../middleWares/validation.js"
export const addTeamSchema ={
    body:joi.object({
        name:joi.string().min(3).max(15).required(),
        position:joi.string().min(3).max(25).required(),
        qoute:joi.string().min(3).max(500),
        alt:joi.string().min(3).max(100).required(),  
    }).required()
}

export const editTeamSchema ={
    params:joi.object({
        memberId:generalFields._id.required()
    }).required(),
    body:joi.object({
        name:joi.string().min(3).max(15),
        position:joi.string().min(3).max(25),
        qoute:joi.string().min(3).max(500),
        alt:joi.string().min(3).max(100),  
    }).required()
}

export const deleteTeamSchema ={
    params:joi.object({
        memberId:generalFields._id.required()
    }).required(),
}

export const getTeamSchema ={
    query:joi.object({
        notActive:joi.string().min(4).max(4).valid('true')
    }).required(),
}