import joi from "joi"
import { generalFields } from "../../middleWares/validation.js"
export const contactSchema ={
    body:joi.object({
        companyName:joi.string().min(3).required(),
        CompanyEmail:generalFields.email.required(),
        phoneNum:generalFields.phoneNumbers.required(),
        note:joi.string().min(3),
        IP:joi.string().ip({ version: ['ipv4', 'ipv6'], cidr: 'forbidden' }).required(),
        service:joi.string().min(3).required(),

    }).required()
}

