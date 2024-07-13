import joi from "joi"
import { generalFields } from "../../middleWares/validation.js"
export const newIPSchema ={
    body:joi.object({
        iPAddress:joi.string().ip({ version: ['ipv4', 'ipv6'], cidr: 'forbidden' }).required(),
        time:joi.date().required(),
    }).required()
}