import { Router } from "express"
import * as serviceController from './service.controller.js'
import { multerCloudFunction } from "../../services/multerCloudinary.js"
import { allowedExtensions } from "../../utils/allowedEtensions.js"
import { asyncHandler } from "../../utils/errorHandeling.js"
import * as serviceValidators from './service.validation.js'
import { validationCoreFunction } from "../../middleWares/validation.js"
const router = Router()

router.post('/add',
    validationCoreFunction(serviceValidators.addServiceSchema),
    asyncHandler(serviceController.addServiceData),
    serviceController.addServiceData)

router.put('/edit/:serviceId',
    validationCoreFunction(serviceValidators.editServiceSchema),
    asyncHandler(serviceController.editService),
    serviceController.editService)

router.patch('/delete/:serviceId',
    validationCoreFunction(serviceValidators.deleteServiceSchema),
    asyncHandler(serviceController.deleteService),
    serviceController.deleteService)

router.get('/get',
    validationCoreFunction(serviceValidators.getServiceSchema),
    asyncHandler(serviceController.getservices),
    serviceController.getservices)

export default router
