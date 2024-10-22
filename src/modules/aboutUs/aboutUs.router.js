import { Router } from "express";
import * as aboutController from './aboutUs.controller.js'
import { asyncHandler } from "../../utils/errorHandeling.js";
import { convertToWebP, multerCloudFunction } from './../../services/multerCloudinary.js';
import { allowedExtensions } from "../../utils/allowedEtensions.js";
import { validationCoreFunction } from "../../middleWares/validation.js";
import * as aboutValidators from './aboutUs.validation.js'
const router = Router()


router.post('/add',
    multerCloudFunction(allowedExtensions.Image).fields([
        { name: 'Image1', maxCount: 1 },
        { name: 'Image2', maxCount: 1 },

        { name: 'missionVisionImage', maxCount: 1 },
        { name: 'ourStoryImage1', maxCount: 1 },
        { name: 'ourStoryImage2', maxCount: 1 },
        { name: 'ourValueImage', maxCount: 1 },

        { name: 'howWeWorkImage1', maxCount: 1 },
        { name: 'howWeWorkImage2', maxCount: 1 },
        { name: 'howWeWorkImage3', maxCount: 1 },
        { name: 'howWeWorkImage4', maxCount: 1 },


    ]),
    convertToWebP,
    validationCoreFunction(aboutValidators.addAboutSchema),
    asyncHandler(aboutController.addAboutData),
)


router.put('/edit',
    multerCloudFunction(allowedExtensions.Image).fields([
        { name: 'Image1', maxCount: 1 },
        { name: 'Image2', maxCount: 1 },

        { name: 'missionVisionImage', maxCount: 1 },
        { name: 'ourStoryImage1', maxCount: 1 },
        { name: 'ourStoryImage2', maxCount: 1 },
        { name: 'ourValueImage', maxCount: 1 },

        { name: 'howWeWorkImage1', maxCount: 1 },
        { name: 'howWeWorkImage2', maxCount: 1 },
        { name: 'howWeWorkImage3', maxCount: 1 },
        { name: 'howWeWorkImage4', maxCount: 1 },
        ]),
    convertToWebP,
    validationCoreFunction(aboutValidators.editAboutSchema),
    asyncHandler(aboutController.editAboutData),
    aboutController.editAboutData)


router.delete('/delete',
    // validationCoreFunction(aboutValidators.deleteAboutSchema),
    asyncHandler(aboutController.deleteAbout),
    aboutController.deleteAbout)


router.get('/get',
    asyncHandler(aboutController.getAbout),
    aboutController.getAbout)

router.get('/getWhyUs',
    asyncHandler(aboutController.getWhyUsData),
    aboutController.getWhyUsData)


export default router