import { Router } from "express";
import * as teamController from './ourTeam.controller.js'
import { asyncHandler } from "../../utils/errorHandeling.js";
import { multerCloudFunction } from './../../services/multerCloudinary.js';
import { allowedExtensions } from "../../utils/allowedEtensions.js";
import * as teamValidators from './ourTeam.validation.js'
import { validationCoreFunction } from "../../middlewares/validation.js";
const router = Router()

router.post('/add',
    multerCloudFunction(allowedExtensions.Image).single('image'),
    validationCoreFunction(teamValidators.addTeamSchema),
    asyncHandler(teamController.addTeamMember),
    teamController.addTeamMember)

router.put('/edit/:memberId',
    multerCloudFunction(allowedExtensions.Image).single('image'),
    validationCoreFunction(teamValidators.editTeamSchema),
    asyncHandler(teamController.editTeamMember),
    teamController.editTeamMember)

router.delete('/delete/:memberId',
    validationCoreFunction(teamValidators.deleteTeamSchema),
    asyncHandler(teamController.deleteTeamMember),
    teamController.deleteTeamMember)

router.get('/get',
    asyncHandler(teamController.getTeam),
    teamController.getTeam)


export default router