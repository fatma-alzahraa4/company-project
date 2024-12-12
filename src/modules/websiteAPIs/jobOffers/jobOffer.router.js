import { Router } from "express";
import * as jobControllers from './jobOffer.controller.js'
import { asyncHandler } from '../../../utils/errorHandeling.js';
import { validationCoreFunction } from "../../../middleWares/validation.js";
const router = Router()

router.get('/getJobs',
  asyncHandler(jobControllers.getJobs)
)

router.get('/getJob/:jobId',
  asyncHandler(jobControllers.getJob)
)
export default router