import { aboutModel } from "../../../DB/models/aboutUsModel.js"
import { customAlphabet } from 'nanoid';
import cloudinary from "../../utils/cloudinaryConfigrations.js";
const nanoId = customAlphabet('abcdefghijklmnopqrstuvwxyz123456890', 5)
const getFileNameWithoutExtension = (filename) => {
    return filename.split('.').slice(0, -1).join('.');
};

export const addAboutData = async (req, res, next) => {
    const {
        mission,
        vission,
        ourStory,
        ourValue,
        whyUsTitle,
        whyUsDesc,
        whyUsPoints,
        metaDesc,
        metaKeyWords,
    } = req.body

    if (!req.files['Image1']) {
        return next(new Error('Please upload image 1', { cause: 400 }));
    }
    if (!req.files['Image2']) {
        return next(new Error('Please upload image 2', { cause: 400 }));
    }

    const file1 = req.files['Image1'][0];
    const file2 = req.files['Image2'][0];

    const Image1Name = getFileNameWithoutExtension(file1.originalname);
    const Image2Name = getFileNameWithoutExtension(file2.originalname);
    // const customId = `${fileName}_${moment().format('DD/MM/YYYY/_HH:mm:ss')}`;
    const customId1 = `${Image1Name}_${nanoId()}`
    const customId2 = `${Image2Name}_${nanoId()}`
    const { secure_url: secureUrl1, public_id: publicId1 } = await cloudinary.uploader.upload(req.files['Image1'][0].path, {
        folder: `${process.env.PROJECT_FOLDER}/whyUs/${customId1}`
    });
    const { secure_url: secureUrl2, public_id: publicId2 } = await cloudinary.uploader.upload(req.files['Image2'][0].path, {
        folder: `${process.env.PROJECT_FOLDER}/whyUs/${customId2}`
    });

    req.imagePaths = {
        image1: `${process.env.PROJECT_FOLDER}/whyUs/${customId1}`,
        image2: `${process.env.PROJECT_FOLDER}/whyUs/${customId2}`
    };

    const aboutObj = {
        mission,
        vission,
        ourStory,
        ourValue,
        whyUsTitle,
        whyUsDesc,
        whyUsPoints,
        metaDesc,
        metaKeyWords,
        whyUsImage1: { secure_url: secureUrl1, public_id: publicId1, customId: customId1 },
        whyUsImage2: { secure_url: secureUrl2, public_id: publicId2, customId: customId2 },

    }
    const newAbout = await aboutModel.create(aboutObj)
    if (!newAbout) {
        await cloudinary.api.delete_resources([publicId1, publicId2]);
        await Promise.all([
            cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/whyUs/${newAbout.whyUsImage1.customId}`),
            cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/whyUs/${newAbout.whyUsImage2.customId}`)
        ]);
        return next(new Error('creation failed', { cause: 400 }))
    }
    res.status(200).json({ message: 'Done', newAbout })

}

export const editAboutData = async (req, res, next) => {
    // const { aboutId } = req.params
    const {
        mission,
        vission,
        ourStory,
        ourValue,
        whyUsTitle,
        whyUsDesc,
        whyUsPoints,
        metaDesc,
        metaKeyWords,
    } = req.body
    const about = await aboutModel.findOne()
    if (!about) {
        return next(new Error('no about exist', { cause: 400 }))
    }

    // const customId = `${fileName}_${moment().format('DD/MM/YYYY/_HH:mm:ss')}`;
    let whyUs_Image1
    let whyUs_Image2
    if (req.files) {
        if (req.files['Image1']) {
            const file1 = req.files['Image1'][0];
            const Image1Name = getFileNameWithoutExtension(file1.originalname);
            const customId1 = `${Image1Name}_${nanoId()}`

            await cloudinary.uploader.destroy(about.whyUsImage1.public_id)
            await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/whyUs/${about.whyUsImage1.customId}`)
            const { secure_url: secureUrl1, public_id: publicId1 } = await cloudinary.uploader.upload(req.files['Image1'][0].path, {
                folder: `${process.env.PROJECT_FOLDER}/whyUs/${customId1}`
            });
            whyUs_Image1 = { secure_url: secureUrl1, public_id: publicId1, customId: customId1 }
        }
        else {
            whyUs_Image1 = about.whyUsImage1
        }
        if (req.files['Image2']) {
            const file2 = req.files['Image2'][0];
            const Image2Name = getFileNameWithoutExtension(file2.originalname);
            const customId2 = `${Image2Name}_${nanoId()}`

            await cloudinary.uploader.destroy(about.whyUsImage2.public_id)
            await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/whyUs/${about.whyUsImage2.customId}`)
            const { secure_url: secureUrl2, public_id: publicId2 } = await cloudinary.uploader.upload(req.files['Image2'][0].path, {
                folder: `${process.env.PROJECT_FOLDER}/whyUs/${customId2}`
            });
            whyUs_Image2 = { secure_url: secureUrl2, public_id: publicId2, customId: customId2 }
        }
        else {
            whyUs_Image2 = about.whyUsImage2
        }
    }
    else{
        whyUs_Image1 = about.whyUsImage1
        whyUs_Image2 = about.whyUsImage2
    }


    if (!mission) {
        about.mission = about.mission
    }
    else {
        about.mission = mission
    }
    if (!vission) {
        about.vission = about.vission
    }
    else {
        about.vission = vission
    }
    if (!ourStory) {
        about.ourStory = about.ourStory
    }
    else {
        about.ourStory = ourStory
    }
    if (!ourValue) {
        about.ourValue = about.ourValue
    }
    else {
        about.ourValue = ourValue
    }
    if (!whyUsTitle) {
        about.whyUsTitle = about.whyUsTitle
    }
    else {
        about.whyUsTitle = whyUsTitle
    }
    if (!whyUsDesc) {
        about.whyUsDesc = about.whyUsDesc
    }
    else {
        about.whyUsDesc = whyUsDesc
    }
    if (!whyUsPoints) {
        about.whyUsPoints = about.whyUsPoints
    }
    else {
        about.whyUsPoints = whyUsPoints
    }
    if (!metaDesc) {
        about.metaDesc = about.metaDesc
    }
    else {
        about.metaDesc = metaDesc
    }
    if (!metaKeyWords) {
        about.metaKeyWords = about.metaKeyWords
    }
    else {
        about.metaKeyWords = metaKeyWords
    }


    about.whyUsImage1 = whyUs_Image1
    about.whyUsImage2 = whyUs_Image2

    const updatedAbout = await about.save()
    if (!updatedAbout) {
        await cloudinary.api.delete_resources([publicId1, publicId2]);
        await Promise.all([
            cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/whyUs/${customId1}`),
            cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/whyUs/${customId2}`)
        ]);
        return next(new Error('update failed', { cause: 400 }))

    }
    res.status(200).json({ message: 'Done', updatedAbout })
}

export const deleteAbout = async (req, res, next) => {
    // const { aboutId } = req.params
    const deletedAbout = await aboutModel.findOneAndDelete()
    if (!deletedAbout) {
        return next(new Error('failed to delete', { cause: 400 }))
    }
    await cloudinary.api.delete_resources([deletedAbout.whyUsImage1.public_id, deletedAbout.whyUsImage2.public_id]);
    await Promise.all([
        cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/whyUs/${deletedAbout.whyUsImage1.customId}`),
        cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/whyUs/${deletedAbout.whyUsImage2.customId}`)
    ]);
    return res.status(200).json({ message: 'Done', deletedAbout })

}


export const getAbout = async (req, res, next) => {
    const about = await aboutModel.findOne()
    if (!about) {
        return next(new Error('failed to get about comapny data', { cause: 400 }))
    }
    return res.status(200).json({ message: 'Done', about })
}

export const getWhyUsData = async (req, res, next) => {
    const whyUsData = await aboutModel.findOne().select('-_id whyUs whyUsImage1 whyUsImage2')
    if (!whyUsData) {
        return next(new Error('failed to get why Us data', { cause: 400 }))
    }
    return res.status(200).json({ message: 'Done', whyUsData })
}