import { Router } from "express";
import * as projectControllers from './project.controller.js'
import * as projectValidators from './project.validation.js'
import { asyncHandler } from './../../utils/errorHandeling.js';
import { convertToWebP, multerCloudFunction } from './../../services/multerCloudinary.js';
import { allowedExtensions } from './../../utils/allowedEtensions.js';
import { validationCoreFunction } from "../../middleWares/validation.js";
import { isAuth } from "../../middleWares/auth.js";
import { projectApisRoles } from "./project.roles.js";
const router = Router()
const combinedExtensions = [...allowedExtensions.Image,...allowedExtensions.Videos]

router.post('/add',
    isAuth(projectApisRoles.ADD_PROJECT),
    multerCloudFunction(allowedExtensions.Image).single('mainImage'),
    convertToWebP,
    validationCoreFunction(projectValidators.addProjectSchema),
    asyncHandler(projectControllers.addProject)
)

router.put('/edit/:projectId', 
    isAuth(projectApisRoles.EDIT_PROJECT),
    multerCloudFunction(allowedExtensions.Image).single('mainImage'),
    convertToWebP,
    validationCoreFunction(projectValidators.editProjectSchema),
    asyncHandler(projectControllers.editProject)
)

router.post('/addImages',
    isAuth(projectApisRoles.ADD_PROJECT),
    multerCloudFunction(allowedExtensions.Image).fields([
        { name: 'images', maxCount: 4 },
    ]),
    convertToWebP,
    validationCoreFunction(projectValidators.addProjectImagesSchema),
    asyncHandler(projectControllers.addProjectImages)
)

router.delete('/deleteImage/:imageId',
    isAuth(projectApisRoles.DELETE_PROJECT),
    validationCoreFunction(projectValidators.deleteProjectImageSchema),
    asyncHandler(projectControllers.deleteProjectImage)
)

router.delete('/delete/:projectId',
    isAuth(projectApisRoles.DELETE_PROJECT),
    validationCoreFunction(projectValidators.deleteProjectSchema),
    asyncHandler(projectControllers.deleteProject)
)

router.get('/getProjects',
    isAuth(projectApisRoles.GET_PROJECTS),
    asyncHandler(projectControllers.getProjects)
)

router.get('/getProject/:projectId',
    isAuth(projectApisRoles.GET_PROJECTS),
    validationCoreFunction(projectValidators.getProjectSchema),
    asyncHandler(projectControllers.getProject)
)
export default router