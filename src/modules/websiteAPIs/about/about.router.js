import { Router } from 'express'
import * as aboutControllers from './about.controller.js'
import { asyncHandler } from "../../../utils/errorHandeling.js"
const router = Router()


router.get('/getAbout',
    asyncHandler(aboutControllers.aboutData),
)

export default router
