import joi from "joi"
import { generalFields } from "../../middleWares/validation.js"
export const contactSchema ={
    body:joi.object({
        companyName:joi.string().min(3).max(30).required(),
        CompanyEmail:generalFields.email.required(),
        phoneNum:generalFields.phoneNumbers.required(),
        note:joi.string().min(3).max(500),
        IP:joi.string().ip({ version: ['ipv4', 'ipv6'], cidr: 'forbidden' }).required(),
        subService:joi.string().min(3).max(30).required(),

    }).required()
}

