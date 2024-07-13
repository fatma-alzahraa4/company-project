import { Router } from "express"
import * as subServiceController from './subService.controller.js'
import * as subServiceValidators from './subService.validation.js'
import { asyncHandler } from "../../utils/errorHandeling.js"
import { validationCoreFunction } from "../../middlewares/validation.js"
const router = Router()

router.post('/add',
    validationCoreFunction(subServiceValidators.addSubServiceSchema),
    asyncHandler(subServiceController.addSubServiceData),
    subServiceController.addSubServiceData)

router.put('/edit/:subserviceId',
    validationCoreFunction(subServiceValidators.editSubServiceSchema),
    asyncHandler(subServiceController.editSubService),
    subServiceController.editSubService)

router.delete('/delete/:subserviceId',
    validationCoreFunction(subServiceValidators.deleteSubServiceSchema),
    asyncHandler(subServiceController.deleteSubService),
    subServiceController.deleteSubService)

router.get('/get',
    asyncHandler(subServiceController.getSubServices),
    subServiceController.getSubServices)

export default router
