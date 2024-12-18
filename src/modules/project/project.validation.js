import joi from "joi"
import { generalFields } from "../../middleWares/validation.js"

export const addProjectSchema = {
    body: joi.object({
        name: joi.string().min(3).required(),
        projectLink: joi.string().uri(),
        clientId:generalFields._id.required(),
        details: joi.string().min(3).required(),
        status:joi.string().valid('Pending','InProgress','Completed').required(),
        progressPercentage:joi.number().min(0).max(100),
        altImage: joi.string().min(3).required(),
        categoryId:generalFields._id,
        date:joi.date().required(),
        video: joi.string().uri(),
    }).required()
}

export const editProjectSchema = {
    params: joi.object({
        projectId:generalFields._id.required(),
    }).required(),
    body: joi.object({
        name: joi.string().min(3),
        projectLink: joi.string().uri(),
        clientId:generalFields._id,
        details: joi.string().min(3),
        status:joi.string().valid('Pending','InProgress','Completed'),
        progressPercentage:joi.number().min(0).max(100),
        altImage: joi.string().min(3),
        categoryId:generalFields._id,
        date:joi.date(),
        video: joi.string().uri(),

    }).required()
}

export const deleteProjectSchema = {
    params: joi.object({
        projectId:generalFields._id.required(),
    }).required(),
}

export const getProjectSchema = {
    params: joi.object({
        projectId:generalFields._id.required(),
    }).required(),
}

export const addProjectImagesSchema = {
    body: joi.object({
        projectId:generalFields._id.required(),        
        altImage: joi.string().min(3).required(),
    }).required()
}

export const deleteProjectImageSchema = {
    params: joi.object({
        imageId:generalFields._id.required(),
    }).required(),
}

export const addProjectVideosSchema = {
    body: joi.object({
        projectId:generalFields._id.required(),        
    }).required()
}

export const deleteProjectVideoSchema = {
    params: joi.object({
        videoId:generalFields._id.required(),
    }).required(),
}