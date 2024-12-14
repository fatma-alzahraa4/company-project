import { Router } from "express";
import { asyncHandler } from '../../../utils/errorHandeling.js';
import { getServices } from "./services.controller.js";
const router = Router()

router.get('/getServices',
    asyncHandler(getServices),
)

export default router