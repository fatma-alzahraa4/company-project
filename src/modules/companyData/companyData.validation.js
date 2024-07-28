import joi from "joi"
import { generalFields } from "../../middleWares/validation.js"
export const addCompanySchema = {
    body: joi.object({
        companyName: joi.string().min(3).required(),
        email: generalFields.email.required(),
        phoneNum: generalFields.phoneNumbers.required(),
        landLine: joi.string().min(4),
        mapLink: joi.string().uri(),
        Facebook: joi.string().uri(),
        Instagram: joi.string().uri(),
        Twitter: joi.string().uri(),
        Linkedin: joi.string().uri(),
        SnapChat: joi.string().uri(),
        Tiktok: joi.string().uri(),
        metaDesc: joi.string().min(3).required(),
        metaKeyWords: joi.string().min(3),
        altLogo: joi.string().min(3).required(),
        altContact: joi.string().min(3).required(),
        address: joi.string().min(3).required(),
        slogan: joi.string().min(3).required(),

    }).required()
}

export const editCompanySchema = {
    body: joi.object({
        companyName: joi.string().min(3),
        email: generalFields.email,
        phoneNum: generalFields.phoneNumbers,
        landLine: joi.string().min(4),
        mapLink: joi.string().uri(),
        Facebook: joi.string().uri(),
        Instagram: joi.string().uri(),
        Twitter: joi.string().uri(),
        Linkedin: joi.string().uri(),
        SnapChat: joi.string().uri(),
        Tiktok: joi.string().uri(),
        metaDesc: joi.string().min(3),
        metaKeyWords: joi.string().min(3),
        altLogo: joi.string().min(3),
        altContact: joi.string().min(3),
        address: joi.string().min(3),
        slogan: joi.string().min(3),
    }).required()
}

