import joi from "joi"
import { generalFields } from "../../middleWares/validation.js"
export const addAboutSchema ={
    body:joi.object({
        mission:joi.string().min(3).required(),
        vission:joi.string().min(3).required(),
        ourStory:joi.string().min(3).required(),
        ourValue:joi.string().min(3).required(),
        whyUsTitle:joi.string().min(3).required(),
        whyUsDesc:joi.string().min(3).required(),
        whyUsPoints:joi.array().items(joi.string().required()).required(),
        metaDesc:joi.string().min(3).required(),
        metaKeyWords:joi.string().min(3), 
        altImage1:joi.string().min(3).required(),  
        altImage2:joi.string().min(3).required(),  
    }).required()
}

export const editAboutSchema ={
    body:joi.object({
        mission:joi.string().min(3),
        vission:joi.string().min(3),
        ourStory:joi.string().min(3),
        ourValue:joi.string().min(3),
        whyUsTitle:joi.string().min(3),
        whyUsDesc:joi.string().min(3),
        whyUsPoints:joi.array().items(joi.string().required()),
        metaDesc:joi.string().min(3),
        metaKeyWords:joi.string().min(3),   
        altImage1:joi.string().min(3),  
        altImage2:joi.string().min(3),  
    }).required()
}


