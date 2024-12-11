import { Router } from "express";
import * as jobApplicationControllers from './jobApplication.controller.js';
import * as jobApplicationValidators from './jobApplication.validation.js';
import { asyncHandler } from "../../utils/errorHandeling.js";
import { validationCoreFunction } from "../../middleWares/validation.js";
import { jobApisRoles } from "./apiRoles.js";
import { isAuth } from '../../middleWares/auth.js';
import { multerCloudFunction } from "../../services/multerCloudinary.js";
import { allowedExtensions } from "../../utils/allowedEtensions.js";

  const router = Router()

router.post('/addJobOffer',
    isAuth(jobApisRoles.JOB_APIS),
    validationCoreFunction(jobApplicationValidators.addJobOfferSchema),
    asyncHandler(jobApplicationControllers.addJobOffer),
);

router.put('/editJobOffer/:jobId',
    isAuth(jobApisRoles.JOB_APIS),
    validationCoreFunction(jobApplicationValidators.editJobOfferSchema),
    asyncHandler(jobApplicationControllers.editJobOffer),
)

router.get('/getJobOffers',
    isAuth(jobApisRoles.JOB_APIS),
    asyncHandler(jobApplicationControllers.getJobOffers),
)

router.get('/getJobOffer/:jobId',
    isAuth(jobApisRoles.JOB_APIS),
    validationCoreFunction(jobApplicationValidators.getJobOfferSchema),
    asyncHandler(jobApplicationControllers.getJobOffer),
)

router.delete('/deleteJobOffer/:jobId',
    isAuth(jobApisRoles.JOB_APIS),
    validationCoreFunction(jobApplicationValidators.deleteJobOfferSchema),
    asyncHandler(jobApplicationControllers.deleteJobOffer),
)

router.get('/getJobApplicants/:jobId',
    isAuth(jobApisRoles.JOB_APIS),
    validationCoreFunction(jobApplicationValidators.getJobApplicantsSchema),
    asyncHandler(jobApplicationControllers.getJobApplicants),
)
router.delete('/deleteJobApplicant/:jobApplicantId',
    isAuth(jobApisRoles.JOB_APIS),
    validationCoreFunction(jobApplicationValidators.deleteJobApplicantSchema),
    asyncHandler(jobApplicationControllers.deleteJobApplicant),
);

router.post('/applyToJob/:jobId',
    validationCoreFunction(jobApplicationValidators.applyToJobSchema),
    asyncHandler(jobApplicationControllers.applyToJob),
);


export default router