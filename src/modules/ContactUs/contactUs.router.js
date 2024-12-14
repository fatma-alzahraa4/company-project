import { Router } from "express"
import * as contactController from './contactUs.controller.js'
import * as contactValidators from './contactUs.validation.js'
import { asyncHandler } from "../../utils/errorHandeling.js"
import { validationCoreFunction } from "../../middleWares/validation.js"
const router = Router()

router.post('/send',
    validationCoreFunction(contactValidators.contactSchema),
    asyncHandler(contactController.contact),
)

router.get('/get',
    asyncHandler(contactController.getContactUsers),
)

export default router
