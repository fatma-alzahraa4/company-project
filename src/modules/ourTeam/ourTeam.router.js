import { Router } from "express";
import * as teamController from './ourTeam.controller.js'
import { asyncHandler } from "../../utils/errorHandeling.js";
import { convertToWebP, multerCloudFunction } from './../../services/multerCloudinary.js';
import { allowedExtensions } from "../../utils/allowedEtensions.js";
import * as teamValidators from './ourTeam.validation.js'
import { validationCoreFunction } from "../../middleWares/validation.js";
import { isAuth } from "../../middleWares/auth.js";
import { teamRoles } from "./ourTeam.roles.js";
const router = Router()

router.post('/add',
    isAuth(teamRoles.ALL_APIS),
    multerCloudFunction(allowedExtensions.Image).single('image'),
    convertToWebP,
    validationCoreFunction(teamValidators.addTeamSchema),
    asyncHandler(teamController.addTeamMember),
)

router.put('/edit/:memberId',
    isAuth(teamRoles.ALL_APIS),
    multerCloudFunction(allowedExtensions.Image).single('image'),
    convertToWebP,
    validationCoreFunction(teamValidators.editTeamSchema),
    asyncHandler(teamController.editTeamMember),
)

router.patch('/delete/:memberId',
    isAuth(teamRoles.ALL_APIS),
    validationCoreFunction(teamValidators.deleteTeamSchema),
    asyncHandler(teamController.deleteTeamMember),
)

router.get('/get',
    isAuth(teamRoles.ALL_APIS),
    validationCoreFunction(teamValidators.getTeamSchema),
    asyncHandler(teamController.getTeam),
)


export default router