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
        missionTitle,
        vission,
        vissionTitle,
        ourStory,
        ourStoryTitle,
        ourValue,
        ourValueTitle,
        whyUsTitle,
        whyUsDesc,
        whyUsSubtitle,
        whyUsImage1Alt,
        whyUsImage2Alt,
        howWeWorkMainTitle,
        howWeWorkArr,
        howWeWorkAlt,
        metaDesc,
        metaKeyWords,
    } = req.body

    // await aboutModel.deleteMany()
    if (!req.files['Image1']) {
        return next(new Error('Please upload image 1', { cause: 400 }));
    }
    if (!req.files['Image2']) {
        return next(new Error('Please upload image 2', { cause: 400 }));
    }
    if (!req.files['howWeWorkImage1']) {
        return next(new Error('Please upload how work image 1', { cause: 400 }));
    }
    if (!req.files['howWeWorkImage2']) {
        return next(new Error('Please upload how work image 2', { cause: 400 }));
    }
    if (!req.files['howWeWorkImage3']) {
        return next(new Error('Please upload how work image 3', { cause: 400 }));
    }
    if (!req.files['howWeWorkImage4']) {
        return next(new Error('Please upload how work image 4', { cause: 400 }));
    }



    const file1 = req.files['Image1'][0];
    const file2 = req.files['Image2'][0];
    const hwfile1 = req.files['howWeWorkImage1'][0];
    const hwfile2 = req.files['howWeWorkImage2'][0];
    const hwfile3 = req.files['howWeWorkImage3'][0];
    const hwfile4 = req.files['howWeWorkImage4'][0];



    const Image1Name = getFileNameWithoutExtension(file1.originalname);
    const Image2Name = getFileNameWithoutExtension(file2.originalname);
    const hwImage1Name = getFileNameWithoutExtension(hwfile1.originalname);
    const hwImage2Name = getFileNameWithoutExtension(hwfile2.originalname);
    const hwImage3Name = getFileNameWithoutExtension(hwfile3.originalname);
    const hwImage4Name = getFileNameWithoutExtension(hwfile4.originalname);

    const customId1 = `${Image1Name}_${nanoId()}`
    const customId2 = `${Image2Name}_${nanoId()}`
    const hwCustomId1 = `${hwImage1Name}_${nanoId()}`
    const hwCustomId2 = `${hwImage2Name}_${nanoId()}`
    const hwCustomId3 = `${hwImage3Name}_${nanoId()}`
    const hwCustomId4 = `${hwImage4Name}_${nanoId()}`


    const { secure_url: secureUrl1, public_id: publicId1 } = await cloudinary.uploader.upload(req.files['Image1'][0].path, {
        folder: `${process.env.PROJECT_FOLDER}/whyUs/${customId1}`
    });
    const { secure_url: secureUrl2, public_id: publicId2 } = await cloudinary.uploader.upload(req.files['Image2'][0].path, {
        folder: `${process.env.PROJECT_FOLDER}/whyUs/${customId2}`
    });
    const { secure_url: hwImgsecureUrl1, public_id: hwImgpublicId1 } = await cloudinary.uploader.upload(req.files['howWeWorkImage1'][0].path, {
        folder: `${process.env.PROJECT_FOLDER}/howWeWork/${hwCustomId1}`
    });
    const { secure_url: hwImgsecureUrl2, public_id: hwImgpublicId2 } = await cloudinary.uploader.upload(req.files['howWeWorkImage2'][0].path, {
        folder: `${process.env.PROJECT_FOLDER}/howWeWork/${hwCustomId2}`
    });
    const { secure_url: hwImgsecureUrl3, public_id: hwImgpublicId3 } = await cloudinary.uploader.upload(req.files['howWeWorkImage3'][0].path, {
        folder: `${process.env.PROJECT_FOLDER}/howWeWork/${hwCustomId3}`
    });
    const { secure_url: hwImgsecureUrl4, public_id: hwImgpublicId4 } = await cloudinary.uploader.upload(req.files['howWeWorkImage4'][0].path, {
        folder: `${process.env.PROJECT_FOLDER}/howWeWork/${hwCustomId4}`
    });

    req.imagePaths = {
        image1: `${process.env.PROJECT_FOLDER}/whyUs/${customId1}`,
        image2: `${process.env.PROJECT_FOLDER}/whyUs/${customId2}`,
        hwImage1: `${process.env.PROJECT_FOLDER}/howWeWork/${hwCustomId1}`,
        hwImage2: `${process.env.PROJECT_FOLDER}/howWeWork/${hwCustomId2}`,
        hwImage3: `${process.env.PROJECT_FOLDER}/howWeWork/${hwCustomId3}`,
        hwImage4: `${process.env.PROJECT_FOLDER}/howWeWork/${hwCustomId4}`,

    };


    let howArr = [];
    if (howWeWorkArr && howWeWorkArr.length) {
        const imageUrls = [
            { secure_url: hwImgsecureUrl1, public_id: hwImgpublicId1, customId: hwCustomId1, alt: howWeWorkAlt },
            { secure_url: hwImgsecureUrl2, public_id: hwImgpublicId2, customId: hwCustomId2, alt: howWeWorkAlt },
            { secure_url: hwImgsecureUrl3, public_id: hwImgpublicId3, customId: hwCustomId3, alt: howWeWorkAlt },
            { secure_url: hwImgsecureUrl4, public_id: hwImgpublicId4, customId: hwCustomId4, alt: howWeWorkAlt }
        ];

        for (let i = 0; i < howWeWorkArr.length; i++) {
            let hWork = howWeWorkArr[i];
            hWork.image = imageUrls[i];

            howArr.push({
                title: hWork.title,
                desc: hWork.desc,
                image: hWork.image
            });
        }
    }

    const aboutObj = {
        mission,
        missionTitle,
        vission,
        vissionTitle,
        ourStory,
        ourStoryTitle,
        ourValue,
        ourValueTitle,
        whyUsTitle,
        whyUsDesc,
        whyUsSubtitle,
        metaDesc,
        metaKeyWords,
        howWeWorkMainTitle,
        howWeWork: howArr,
        whyUsImage1: { secure_url: secureUrl1, public_id: publicId1, customId: customId1, alt: whyUsImage1Alt },
        whyUsImage2: { secure_url: secureUrl2, public_id: publicId2, customId: customId2, alt: whyUsImage2Alt },

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
        missionTitle,
        vission,
        vissionTitle,
        ourStory,
        ourStoryTitle,
        ourValue,
        ourValueTitle,
        whyUsTitle,
        whyUsDesc,
        whyUsSubtitle,
        whyUsImage1Alt,
        whyUsImage2Alt,
        howWeWorkMainTitle,
        howWeWorkArr,
        howWeWorkAlt,
        metaDesc,
        metaKeyWords,
    } = req.body
    const about = await aboutModel.findOne()
    if (!about) {
        return next(new Error('no about exist', { cause: 400 }))
    }

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
    else {
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
    about.missionTitle = missionTitle || about.missionTitle
    about.vissionTitle = vissionTitle || about.vissionTitle,
    about.ourStoryTitle = ourStoryTitle || about.ourStoryTitle,
    about.ourValueTitle = ourValueTitle || about.ourValueTitle,
    about.whyUsSubtitle = whyUsSubtitle || about.whyUsSubtitle,
    about.howWeWorkMainTitle = howWeWorkMainTitle || about.howWeWorkMainTitle,
    about.whyUsImage1 = {...whyUs_Image1,alt:whyUsImage1Alt} || whyUs_Image1
    about.whyUsImage2 = {...whyUs_Image2,alt:whyUsImage2Alt} || whyUs_Image1
    if (howWeWorkArr) {
        for (let i = 0; i < howWeWorkArr.length; i++) {
            let hWork = howWeWorkArr[i];

            if (req.files && req.files[`howWeWorkImage${i + 1}`]) {
                const file = req.files[`howWeWorkImage${i + 1}`][0];
                const imageName = getFileNameWithoutExtension(file.originalname);
                const customId = `${imageName}_${nanoId()}`;

                if (about.howWeWork[i] && about.howWeWork[i].image && about.howWeWork[i].image.public_id) {
                    await cloudinary.uploader.destroy(about.howWeWork[i].image.public_id);
                    await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/howWeWork/${about.howWeWork[i].image.customId}`);
                }

                const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                    folder: `${process.env.PROJECT_FOLDER}/howWeWork/${customId}`
                });

                hWork.image = {
                    secure_url: secure_url,
                    public_id: public_id,
                    customId: customId,
                    alt: howWeWorkAlt
                };
            } else if (about.howWeWork[i]) {
                hWork.image = about.howWeWork[i].image;
            }

            // Ensure title and desc are included
            hWork.title = hWork.title || about.howWeWork[i].title;
            hWork.desc = hWork.desc || about.howWeWork[i].desc;
        }
        about.howWeWork = howWeWorkArr;
    }
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