import { Router } from "express"
import * as subServiceController from './subService.controller.js'
import * as subServiceValidators from './subService.validation.js'
import { asyncHandler } from "../../utils/errorHandeling.js"
import { validationCoreFunction } from "../../middleWares/validation.js"
import { isAuth } from "../../middleWares/auth.js"
import { subServiceRoles } from "./subService.roles.js"
const router = Router()

router.post('/add',
    isAuth(subServiceRoles.ALL_APIS),
    validationCoreFunction(subServiceValidators.addSubServiceSchema),
    asyncHandler(subServiceController.addSubServiceData),
)

router.put('/edit/:subserviceId',
    isAuth(subServiceRoles.ALL_APIS),
    validationCoreFunction(subServiceValidators.editSubServiceSchema),
    asyncHandler(subServiceController.editSubService),
)

router.patch('/delete/:subserviceId',
    isAuth(subServiceRoles.ALL_APIS),
    validationCoreFunction(subServiceValidators.deleteSubServiceSchema),
    asyncHandler(subServiceController.deleteSubService),
)

router.get('/get',
    isAuth(subServiceRoles.ALL_APIS),
    validationCoreFunction(subServiceValidators.getSubServiceSchema),
    asyncHandler(subServiceController.getSubServices),
)

export default router
