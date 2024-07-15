import joi from "joi"
import { generalFields } from "../../middleWares/validation.js"
export const addAboutSchema ={
    body:joi.object({
        mission:joi.string().min(3).max(500).required(),
        vission:joi.string().min(3).max(500).required(),
        ourStory:joi.string().min(3).max(500).required(),
        ourValue:joi.string().min(3).max(500).required(),
        whyUsTitle:joi.string().min(3).max(200).required(),
        whyUsDesc:joi.string().min(3).max(500).required(),
        whyUsPoints:joi.array().items(joi.string().required()).required(),
        metaDesc:joi.string().min(3).max(200).required(),
        metaKeyWords:joi.string().min(3).max(250), 
    }).required()
}

export const editAboutSchema ={
    body:joi.object({
        mission:joi.string().min(3).max(500),
        vission:joi.string().min(3).max(500),
        ourStory:joi.string().min(3).max(500),
        ourValue:joi.string().min(3).max(500),
        whyUsTitle:joi.string().min(3).max(200),
        whyUsDesc:joi.string().min(3).max(500),
        whyUsPoints:joi.array().items(joi.string().required()),
        metaDesc:joi.string().min(3).max(200),
        metaKeyWords:joi.string().min(3).max(250),   
    }).required()
}


