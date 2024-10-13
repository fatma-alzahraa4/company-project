import joi from "joi"
import { generalFields } from "../../../middleWares/validation.js"
export const getProjectSchema = {
    params: joi.object({
        projectId:generalFields._id.required(),
    }).required(),
}
