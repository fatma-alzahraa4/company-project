import { Router } from "express"
import * as serviceController from './service.controller.js'
import * as serviceValidators from './service.validation.js'
import { asyncHandler } from "../../utils/errorHandeling.js"
import { validationCoreFunction } from "../../middleWares/validation.js"
import { isAuth } from "../../middleWares/auth.js"
import { serviceRoles } from "./service.roles.js"
import { allowedExtensions } from './../../utils/allowedEtensions.js';
import { convertToWebP, multerCloudFunction } from './../../services/multerCloudinary.js';
const router = Router()

router.post('/add',
    isAuth(serviceRoles.ALL_APIS),
    multerCloudFunction(allowedExtensions.Image).single('icon'),
    convertToWebP,
    validationCoreFunction(serviceValidators.addServiceSchema),
    asyncHandler(serviceController.addService),
)

router.put('/edit/:serviceId',
    isAuth(serviceRoles.ALL_APIS),
    multerCloudFunction(allowedExtensions.Image).single('icon'),
    convertToWebP,
    validationCoreFunction(serviceValidators.editServiceSchema),
    asyncHandler(serviceController.editService),
)

router.patch('/delete/:serviceId',
    isAuth(serviceRoles.ALL_APIS),
    validationCoreFunction(serviceValidators.deleteServiceSchema),
    asyncHandler(serviceController.deleteService),
)

router.get('/get',
    isAuth(serviceRoles.ALL_APIS),
    validationCoreFunction(serviceValidators.getServiceSchema),
    asyncHandler(serviceController.getServices),
)

export default router
