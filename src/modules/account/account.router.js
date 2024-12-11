import { Router } from "express";
import * as adminAuthController from './account.controller.js';
import * as adminAuthValidators from './account.validation.js';
import { asyncHandler } from "../../utils/errorHandeling.js";
import { validationCoreFunction } from "../../middleWares/validation.js";
import { accountApisRoles } from "./apiRoles.js";
import { isAuth } from '../../middleWares/auth.js';
import { convertToWebP, multerCloudFunction } from './../../services/multerCloudinary.js';
import { allowedExtensions } from "../../utils/allowedEtensions.js";
isAuth
const router = Router()
router.post('/signUp',
    validationCoreFunction(adminAuthValidators.signUpSchema),
    asyncHandler(adminAuthController.adminSignUp),
)

router.put('/verifyEmail',
    asyncHandler(adminAuthController.verifyEmail),
)

router.post('/signIn',
    validationCoreFunction(adminAuthValidators.signInSchema),
    asyncHandler(adminAuthController.signIn),
)

router.get('/resendVerificationCode/:accountId',
    validationCoreFunction(adminAuthValidators.resendCodeSchema),
    asyncHandler(adminAuthController.resendVerificationCode),
)

router.get('/resendForgetCode/:accountId',
    validationCoreFunction(adminAuthValidators.resendCodeSchema),
    asyncHandler(adminAuthController.resendForgetCode),
)

router.post('/forgetPassword',
    validationCoreFunction(adminAuthValidators.forgetPassSchema),
    asyncHandler(adminAuthController.forgetPassword),
)

router.patch('/resetPassword',
    validationCoreFunction(adminAuthValidators.resetPassSchema),
    asyncHandler(adminAuthController.resetPassword),
)

router.patch('/changePassword',
    isAuth(accountApisRoles.CHANGE_PASSWORD),
    validationCoreFunction(adminAuthValidators.changePassSchema),
    asyncHandler(adminAuthController.changePassword),
)

router.patch('/logOut',
    // isAuth(accountApisRoles.LOGOUT),
    // validationCoreFunction(adminAuthValidators.adminSignUp),
    asyncHandler(adminAuthController.logOut),
)

router.post('/addAccount',
    isAuth(accountApisRoles.ADD_ACCOUNT),
    validationCoreFunction(adminAuthValidators.addAccountSchema),
    asyncHandler(adminAuthController.addAccount),
)

router.delete('/deleteAccount/:userId',
    isAuth(accountApisRoles.DELETE_ACCOUNT),
    validationCoreFunction(adminAuthValidators.deleteAccountSchema),
    asyncHandler(adminAuthController.deleteAccount),
)

router.patch('/changeRole',
    isAuth(accountApisRoles.CHANGE_ROLE),
    validationCoreFunction(adminAuthValidators.changeRoleSchema),
    asyncHandler(adminAuthController.changeRole),
)

router.put('/updateProfile',
    isAuth(accountApisRoles.UPDATE_PROFILE),
    multerCloudFunction(allowedExtensions.Image).single('profile'),
    convertToWebP,
    validationCoreFunction(adminAuthValidators.updateProfileSchema),
    asyncHandler(adminAuthController.updateProfile)
)

router.get('/getProfile',
    isAuth(accountApisRoles.GET_PROFILE),
    asyncHandler(adminAuthController.getProfile)
)

router.get('/getAllDashboardUsers',
    isAuth(accountApisRoles.GET_ALL_USERS),
    asyncHandler(adminAuthController.getAllDashboardUsers)
)

router.patch('/changeUserPassword/:userId',
    isAuth(accountApisRoles.CHANGE_PASSWORD),
    validationCoreFunction(adminAuthValidators.changeUserPassSchema),
    asyncHandler(adminAuthController.changeUserPassword),
)

export default router