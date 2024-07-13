import { Router } from "express"
import * as IPController from './IP.controller.js'
import * as IPvalidators from './IP.validation.js'
import { asyncHandler } from "../../utils/errorHandeling.js"
import { validationCoreFunction } from "../../middleWares/validation.js"
const router = Router()

router.post('/newIP',
    validationCoreFunction(IPvalidators.newIPSchema),
    asyncHandler(IPController.newIPAddress),
    IPController.newIPAddress)


router.get('/get',
    asyncHandler(IPController.getIPAddresses),
    IPController.getIPAddresses)

export default router
