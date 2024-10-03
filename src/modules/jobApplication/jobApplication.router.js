import { Router } from "express";
import * as jobApplicationControllers from './jobApplication.controller.js';
import * as jobApplicationValidators from './jobApplication.validation.js';
import { asyncHandler } from "../../utils/errorHandeling.js";
import { validationCoreFunction } from "../../middlewares/validation.js";
import { jobApisRoles } from "./apiRoles.js";
import { isAuth } from './../../middlewares/auth.js';
import { multerCloudFunction } from "../../services/multerCloudinary.js";
import { allowedExtensions } from "../../utils/allowedEtensions.js";
isAuth
const router = Router()

router.post('/addJobOffer',
    // isAuth(jobApisRoles.JOB_APIS),
    // validationCoreFunction(adminAuthValidators.signUpSchema),
    asyncHandler(jobApplicationControllers.addJobOffer),
);

router.put('/editJobOffer/:jobId',
    // isAuth(jobApisRoles.JOB_APIS),
    // validationCoreFunction(adminAuthValidators.resendCodeSchema),
    asyncHandler(jobApplicationControllers.editJobOffer),
)

router.get('/getJobOffers',
    // isAuth(jobApisRoles.JOB_APIS),
    // validationCoreFunction(adminAuthValidators.resendCodeSchema),
    asyncHandler(jobApplicationControllers.getJobOffers),
)

router.get('/getJobOffer/:jobId',
    // isAuth(jobApisRoles.JOB_APIS),
    // validationCoreFunction(adminAuthValidators.resendCodeSchema),
    asyncHandler(jobApplicationControllers.getJobOffer),
)

router.delete('/deleteJobOffer/:jobId',
    // isAuth(jobApisRoles.JOB_APIS),
    // validationCoreFunction(adminAuthValidators.deleteAccountSchema),
    asyncHandler(jobApplicationControllers.deleteJobOffer),
)

router.get('/getJobApplicants/:jobId',
    // isAuth(jobApisRoles.JOB_APIS),
    // validationCoreFunction(adminAuthValidators.resendCodeSchema),
    asyncHandler(jobApplicationControllers.getJobApplicants),
)
router.delete('/deleteJobApplicant/:jobApplicantId',
    // validationCoreFunction(adminAuthValidators.signUpSchema),
    asyncHandler(jobApplicationControllers.deleteJobApplicant),
);

router.post('/applyToJob/:jobId',
    multerCloudFunction(allowedExtensions.Files).single('resume'),
    // validationCoreFunction(adminAuthValidators.signUpSchema),
    asyncHandler(jobApplicationControllers.applyToJob),
);


export default router