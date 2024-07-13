import joi from "joi"
import { generalFields } from "../../middlewares/validation.js"
export const addCompanySchema ={
    body:joi.object({
        companyName:joi.string().min(3).max(25).required(),
        email:generalFields.email.required(),
        phoneNum:generalFields.phoneNumbers.required(),
        landLine:joi.string().min(4).max(15),
        mapLink:joi.string().uri(), 
        Facebook:joi.string().uri(), 
        Instagram:joi.string().uri(),  
        Twitter:joi.string().uri(),  
        Linkedin:joi.string().uri(),  
        SnapChat:joi.string().uri(),  
        Tiktok:joi.string().uri(), 
        metaDesc:joi.string().min(3).max(200).required(),
        metaKeyWords:joi.string().min(3).max(250),  
        alt:joi.string().min(3).max(100).required(),  
    }).required()
}

export const editCompanySchema ={
    body:joi.object({
        companyName:joi.string().min(3).max(25),
        email:generalFields.email,
        phoneNum:generalFields.phoneNumbers,
        landLine:joi.string().min(4).max(15),
        mapLink:joi.string().uri(), 
        Facebook:joi.string().uri(), 
        Instagram:joi.string().uri(),  
        Twitter:joi.string().uri(),  
        Linkedin:joi.string().uri(),  
        SnapChat:joi.string().uri(),  
        Tiktok:joi.string().uri(), 
        metaDesc:joi.string().min(3).max(200),
        metaKeyWords:joi.string().min(3).max(250),  
        alt:joi.string().min(3).max(100),  
    }).required()
}

