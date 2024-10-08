import { Router } from "express";
import * as clientController from './ourClient.controller.js'
import { asyncHandler } from "../../utils/errorHandeling.js";
import { convertToWebP, multerCloudFunction } from './../../services/multerCloudinary.js';
import { allowedExtensions } from "../../utils/allowedEtensions.js";
import * as clientValidators from './ourClient.validation.js'
import { validationCoreFunction } from "../../middleWares/validation.js";
const router = Router()
const combinedExtensions = [
    ...allowedExtensions.Image,
    ...allowedExtensions.Videos,
]
router.post('/add',
    multerCloudFunction(combinedExtensions).fields([
        { name: 'logo', maxCount: 1 },
        { name: 'video', maxCount: 1 }
    ]),
    convertToWebP,
    validationCoreFunction(clientValidators.addClientSchema),
    asyncHandler(clientController.addOurClient),
    clientController.addOurClient)


router.put('/edit/:clientId',
    multerCloudFunction(combinedExtensions).fields([
        { name: 'logo', maxCount: 1 },
        { name: 'video', maxCount: 1 }
    ]),
    convertToWebP,
    validationCoreFunction(clientValidators.editClientSchema),
    asyncHandler(clientController.editClientData),
    clientController.editClientData)

router.patch('/delete/:clientId',
    validationCoreFunction(clientValidators.deleteClientSchema),
    asyncHandler(clientController.deleteClient),
    clientController.deleteClient)

router.get('/get',
    validationCoreFunction(clientValidators.getClientSchema),
    asyncHandler(clientController.getClients),
    clientController.getClients)


export default router