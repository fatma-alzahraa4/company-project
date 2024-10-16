import { Router } from 'express'
import * as aboutControllers from './about.controller.js'
import { asyncHandler } from "../../../utils/errorHandeling.js"
const router = Router()


router.get('/getAbout',
    asyncHandler(aboutControllers.aboutData),
)

// router.get('/getHomeByRedis',
//     asyncHandler(homeController.homeDataByRedis),
// )
export default router
