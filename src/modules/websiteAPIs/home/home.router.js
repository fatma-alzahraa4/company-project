import { Router } from 'express'
import * as homeController from './home.controller.js'
import { asyncHandler } from "../../../utils/errorHandeling.js"
const router = Router()


router.get('/getHome',
    asyncHandler(homeController.homeData),
    homeController.homeData)

export default router
