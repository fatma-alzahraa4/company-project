import { Router } from "express";
import * as companyCntroller from './companyData.controller.js'
import { asyncHandler } from "../../utils/errorHandeling.js";
import { convertToWebP, multerCloudFunction } from './../../services/multerCloudinary.js';
import { allowedExtensions } from "../../utils/allowedEtensions.js";
import { validationCoreFunction } from "../../middleWares/validation.js";
import * as companyValidators from './companyData.validation.js'
import { companyDataRoles } from "./companyData.roles.js";
import { isAuth } from './../../middleWares/auth.js';
const router = Router()

router.post('/add',
    isAuth(companyDataRoles.ALL_APIS),
    multerCloudFunction(allowedExtensions.Image).fields([
        { name: 'logo', maxCount: 1 },
        { name: 'contactUsImage', maxCount: 1 }
    ]),
    convertToWebP,
    validationCoreFunction(companyValidators.addCompanySchema),
    asyncHandler(companyCntroller.addCompanyData),
)

router.put('/edit',
    isAuth(companyDataRoles.ALL_APIS),
    multerCloudFunction(allowedExtensions.Image).fields([
        { name: 'logo', maxCount: 1 },
        { name: 'contactUsImage', maxCount: 1 }
    ]),
    convertToWebP,
    validationCoreFunction(companyValidators.editCompanySchema),
    asyncHandler(companyCntroller.editCompanyData),
)

router.delete('/delete',
    isAuth(companyDataRoles.ALL_APIS),
    asyncHandler(companyCntroller.deleteCompany),
)

router.get('/get',
    isAuth(companyDataRoles.ALL_APIS),
    asyncHandler(companyCntroller.getCompany),
)

router.get('/', (req, res) => { res.json({ message: "hello" }) })

export default router