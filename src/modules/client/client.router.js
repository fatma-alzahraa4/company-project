import { Router } from "express";
import * as clientController from './client.controller.js'
import { asyncHandler } from "../../utils/errorHandeling.js";
import { convertToWebP, multerCloudFunction } from '../../services/multerCloudinary.js';
import { allowedExtensions } from "../../utils/allowedEtensions.js";
import * as clientValidators from './client.validation.js'
import { validationCoreFunction } from "../../middleWares/validation.js";
const router = Router()

router.post('/add',
    multerCloudFunction(allowedExtensions.Image).single('logo'),
    convertToWebP,
    validationCoreFunction(clientValidators.addClientSchema),
    asyncHandler(clientController.addClient),
)


router.put('/edit/:clientId',
    multerCloudFunction(allowedExtensions.Image).single('logo'),
    convertToWebP,
    validationCoreFunction(clientValidators.editClientSchema),
    asyncHandler(clientController.editClientData),
)

router.patch('/delete/:clientId',
    validationCoreFunction(clientValidators.deleteClientSchema),
    asyncHandler(clientController.deleteClient),
)

router.get('/get',
    validationCoreFunction(clientValidators.getClientSchema),
    asyncHandler(clientController.getClients),
)

export default router