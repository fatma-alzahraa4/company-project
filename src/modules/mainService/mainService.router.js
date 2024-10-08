import { Router } from "express"
import * as mainServiceController from './mainService.controller.js'
import {convertToWebP , multerCloudFunction } from "../../services/multerCloudinary.js"
import { allowedExtensions } from "../../utils/allowedEtensions.js"
import { asyncHandler } from "../../utils/errorHandeling.js"
import * as mainServiceValidators from './mainService.validation.js'
import { validationCoreFunction } from "../../middleWares/validation.js"
const router = Router()

router.post('/add',
    multerCloudFunction(allowedExtensions.Image).single('icon'),
    convertToWebP,
    validationCoreFunction(mainServiceValidators.addMainServiceSchema),
    asyncHandler(mainServiceController.addMainServiceData),
    mainServiceController.addMainServiceData)

router.put('/edit/:mainServiceId',
    multerCloudFunction(allowedExtensions.Image).single('icon'),
    convertToWebP,
    validationCoreFunction(mainServiceValidators.editMainServiceSchema),
    asyncHandler(mainServiceController.editMainService),
    mainServiceController.editMainService)

router.patch('/delete/:mainServiceId',
    validationCoreFunction(mainServiceValidators.deleteMainServiceSchema),
    asyncHandler(mainServiceController.deleteMainService),
    mainServiceController.deleteMainService)

router.get('/get',
    validationCoreFunction(mainServiceValidators.getMainServiceSchema),
    asyncHandler(mainServiceController.getMainServices),
    mainServiceController.getMainServices)

export default router