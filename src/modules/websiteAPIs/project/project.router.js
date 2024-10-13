import { Router } from "express";
import * as projectControllers from './project.controller.js'
import * as projectValidators from './project.validation.js'
import { asyncHandler } from '../../../utils/errorHandeling.js';
import { validationCoreFunction } from "../../../middleWares/validation.js";
const router = Router()


router.get('/getProjects',
    asyncHandler(projectControllers.getProjects)
)


router.get('/getProject/:projectId',
    validationCoreFunction(projectValidators.getProjectSchema),
    asyncHandler(projectControllers.getProject)
)

export default router