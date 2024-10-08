import { Router } from "express";
import * as companyCntroller from './companyData.controller.js'
import { asyncHandler } from "../../utils/errorHandeling.js";
import { convertToWebP, multerCloudFunction } from './../../services/multerCloudinary.js';
import { allowedExtensions } from "../../utils/allowedEtensions.js";
import { validationCoreFunction } from "../../middleWares/validation.js";
import * as companyValidators from './companyData.validation.js'
const router = Router()

router.post('/add',
    multerCloudFunction(allowedExtensions.Image).fields([
        { name: 'logo', maxCount: 1 },
        { name: 'contactUsImage', maxCount: 1 }
    ]),
    convertToWebP,
    validationCoreFunction(companyValidators.addCompanySchema),
    asyncHandler(companyCntroller.addCompanyData),
    companyCntroller.addCompanyData)

router.put('/edit',
    multerCloudFunction(allowedExtensions.Image).fields([
        { name: 'logo', maxCount: 1 },
        { name: 'contactUsImage', maxCount: 1 }
    ]),
    convertToWebP,
    validationCoreFunction(companyValidators.editCompanySchema),
    asyncHandler(companyCntroller.editCompanyData),
    companyCntroller.editCompanyData)

router.delete('/delete',
    asyncHandler(companyCntroller.deleteCompany),
    companyCntroller.deleteCompany)

router.get('/get',
    asyncHandler(companyCntroller.getCompany),
    companyCntroller.getCompany)

router.get('/', (req, res) => { res.json({ message: "hello" }) })

export default router