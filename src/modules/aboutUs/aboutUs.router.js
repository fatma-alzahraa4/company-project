import { Router } from "express";
import * as aboutController from './aboutUs.controller.js'
import { asyncHandler } from "../../utils/errorHandeling.js";
import { convertToWebP, multerCloudFunction } from './../../services/multerCloudinary.js';
import { allowedExtensions } from "../../utils/allowedEtensions.js";
import { validationCoreFunction } from "../../middleWares/validation.js";
import * as aboutValidators from './aboutUs.validation.js'
import { isAuth } from "../../middleWares/auth.js";
import { aboutRoles } from "./about.roles.js";
const router = Router()


router.post('/add',
    isAuth(aboutRoles.ALL_APIS),
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
    isAuth(aboutRoles.ALL_APIS),
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
)


router.delete('/delete',
    isAuth(aboutRoles.ALL_APIS),
    // validationCoreFunction(aboutValidators.deleteAboutSchema),
    asyncHandler(aboutController.deleteAbout),
)


router.get('/get',
    isAuth(aboutRoles.ALL_APIS),
    asyncHandler(aboutController.getAbout),
)

router.get('/getWhyUs',
    isAuth(aboutRoles.ALL_APIS),
    asyncHandler(aboutController.getWhyUsData),
)

//how we work
router.post('/addHowWeWork',
    isAuth(aboutRoles.ALL_APIS),
    multerCloudFunction(allowedExtensions.Image).single('image'),
    convertToWebP,
    // validationCoreFunction(aboutValidators.addMainServiceSchema),
    asyncHandler(aboutController.addHowWeWork),
)

router.put('/editHowWeWork/:howWeWorkId',
    isAuth(aboutRoles.ALL_APIS),
    multerCloudFunction(allowedExtensions.Image).single('image'),
    convertToWebP,
    // validationCoreFunction(aboutValidators.addMainServiceSchema),
    asyncHandler(aboutController.editHowWeWork),
)

router.delete('/deleteHowWeWork/:howWeWorkId',
    isAuth(aboutRoles.ALL_APIS),
    // validationCoreFunction(aboutValidators.addMainServiceSchema),
    asyncHandler(aboutController.deleteHowWeWork),
)

export default router