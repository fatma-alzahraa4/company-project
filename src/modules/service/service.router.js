import { Router } from "express"
import * as serviceController from './service.controller.js'
import { multerCloudFunction } from "../../services/multerCloudinary.js"
import { allowedExtensions } from "../../utils/allowedEtensions.js"
import { asyncHandler } from "../../utils/errorHandeling.js"
import * as serviceValidators from './service.validation.js'
import { validationCoreFunction } from "../../middleWares/validation.js"
import { isAuth } from "../../middleWares/auth.js"
import { serviceRoles } from "./service.roles.js"
const router = Router()

router.post('/add',
    isAuth(serviceRoles.ALL_APIS),
    validationCoreFunction(serviceValidators.addServiceSchema),
    asyncHandler(serviceController.addServiceData),
)

router.put('/edit/:serviceId',
    isAuth(serviceRoles.ALL_APIS),
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
    asyncHandler(serviceController.getservices),
)

export default router
