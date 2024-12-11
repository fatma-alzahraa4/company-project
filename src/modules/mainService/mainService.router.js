import { Router } from "express"
import * as mainServiceController from './mainService.controller.js'
import {convertToWebP , multerCloudFunction } from "../../services/multerCloudinary.js"
import { allowedExtensions } from "../../utils/allowedEtensions.js"
import { asyncHandler } from "../../utils/errorHandeling.js"
import * as mainServiceValidators from './mainService.validation.js'
import { validationCoreFunction } from "../../middleWares/validation.js"
import { isAuth } from "../../middleWares/auth.js"
import { mainServiceRoles } from "./mainService.roles.js"
const router = Router()

router.post('/add',
    isAuth(mainServiceRoles.ALL_APIS),
    multerCloudFunction(allowedExtensions.Image).single('icon'),
    convertToWebP,
    validationCoreFunction(mainServiceValidators.addMainServiceSchema),
    asyncHandler(mainServiceController.addMainServiceData),
)

router.put('/edit/:mainServiceId',
    isAuth(mainServiceRoles.ALL_APIS),
    multerCloudFunction(allowedExtensions.Image).single('icon'),
    convertToWebP,
    validationCoreFunction(mainServiceValidators.editMainServiceSchema),
    asyncHandler(mainServiceController.editMainService),
)

router.patch('/delete/:mainServiceId',
    isAuth(mainServiceRoles.ALL_APIS),
    validationCoreFunction(mainServiceValidators.deleteMainServiceSchema),
    asyncHandler(mainServiceController.deleteMainService),
)

router.get('/get',
    isAuth(mainServiceRoles.ALL_APIS),
    validationCoreFunction(mainServiceValidators.getMainServiceSchema),
    asyncHandler(mainServiceController.getMainServices),
)

export default router