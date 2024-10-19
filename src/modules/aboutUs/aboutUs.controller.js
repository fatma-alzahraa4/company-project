import { aboutModel } from "../../../DB/models/aboutUsModel.js"
import { customAlphabet } from 'nanoid';
import cloudinary from "../../utils/cloudinaryConfigrations.js";
import { clientRedis, getOrSetCache } from "../../utils/redis.js";
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
        //new
        missionVisionAlt,
        ourStoryAlt,
        ourValueAlt
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
    //new
    if (!req.files['missionVisionImage']) {
        return next(new Error('Please upload mission and vision image ', { cause: 400 }));
    }
    if (!req.files['ourStoryImage1']) {
        return next(new Error('Please upload Our Story Image 1', { cause: 400 }));
    }
    if (!req.files['ourStoryImage2']) {
        return next(new Error('Please upload Our Story Image 2', { cause: 400 }));
    }
    if (!req.files['ourValueImage']) {
        return next(new Error('Please upload Our Value Image ', { cause: 400 }));
    }




    const file1 = req.files['Image1'][0];
    const file2 = req.files['Image2'][0];
    const hwfile1 = req.files['howWeWorkImage1'][0];
    const hwfile2 = req.files['howWeWorkImage2'][0];
    const hwfile3 = req.files['howWeWorkImage3'][0];
    const hwfile4 = req.files['howWeWorkImage4'][0];
    //new
    const MVfile = req.files['missionVisionImage'][0];
    const OSfile1 = req.files['ourStoryImage1'][0];
    const OSfile2 = req.files['ourStoryImage2'][0];
    const OVfile = req.files['ourValueImage'][0];



    const Image1Name = getFileNameWithoutExtension(file1.originalname);
    const Image2Name = getFileNameWithoutExtension(file2.originalname);
    const hwImage1Name = getFileNameWithoutExtension(hwfile1.originalname);
    const hwImage2Name = getFileNameWithoutExtension(hwfile2.originalname);
    const hwImage3Name = getFileNameWithoutExtension(hwfile3.originalname);
    const hwImage4Name = getFileNameWithoutExtension(hwfile4.originalname);
    //new
    const MVImageName = getFileNameWithoutExtension(MVfile.originalname);
    const OSImage1Name = getFileNameWithoutExtension(OSfile1.originalname);
    const OSImage2Name = getFileNameWithoutExtension(OSfile2.originalname);
    const OVImageName = getFileNameWithoutExtension(OVfile.originalname);


    const customId1 = `${Image1Name}_${nanoId()}`
    const customId2 = `${Image2Name}_${nanoId()}`
    const hwCustomId1 = `${hwImage1Name}_${nanoId()}`
    const hwCustomId2 = `${hwImage2Name}_${nanoId()}`
    const hwCustomId3 = `${hwImage3Name}_${nanoId()}`
    const hwCustomId4 = `${hwImage4Name}_${nanoId()}`
    //new
    const MVCustomId = `${MVImageName}_${nanoId()}`
    const OSCustomId1 = `${OSImage1Name}_${nanoId()}`
    const OSCustomId2 = `${OSImage2Name}_${nanoId()}`
    const OVCustomId = `${OVImageName}_${nanoId()}`


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

    //new
    const { secure_url: MVImgsecureUrl, public_id: MVImgpublicId } = await cloudinary.uploader.upload(req.files['missionVisionImage'][0].path, {
        folder: `${process.env.PROJECT_FOLDER}/about/visionMission/${MVCustomId}`
    });
    const { secure_url: OSImgsecureUrl1, public_id: OSImgpublicId1 } = await cloudinary.uploader.upload(req.files['ourStoryImage1'][0].path, {
        folder: `${process.env.PROJECT_FOLDER}/about/OurStory/${OSCustomId1}`
    });
    const { secure_url: OSImgsecureUrl2, public_id: OSImgpublicId2 } = await cloudinary.uploader.upload(req.files['ourStoryImage2'][0].path, {
        folder: `${process.env.PROJECT_FOLDER}/about/OurStory/${OSCustomId2}`
    });
    const { secure_url: OVImgsecureUrl, public_id: OVImgpublicId } = await cloudinary.uploader.upload(req.files['ourValueImage'][0].path, {
        folder: `${process.env.PROJECT_FOLDER}/about/OurValue/${OVCustomId}`
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
        //neww
        missionVisionImage: { secure_url: MVImgsecureUrl, public_id: MVImgpublicId, customId: MVCustomId, alt: missionVisionAlt },
        ourStoryImage1: { secure_url: OSImgsecureUrl1, public_id: OSImgpublicId1, customId: OSCustomId1, alt: ourStoryAlt },
        ourStoryImage2: { secure_url: OSImgsecureUrl2, public_id: OSImgpublicId2, customId: OSCustomId2, alt: ourStoryAlt },
        ourValueImage: { secure_url: OVImgsecureUrl, public_id: OVImgpublicId, customId: OVCustomId, alt: ourValueAlt },

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
        //new
        missionVisionAlt,
        ourStoryAlt,
        ourValueAlt
    } = req.body
    const about = await aboutModel.findOne()
    if (!about) {
        return next(new Error('no about exist', { cause: 400 }))
    }
    let whyUs_Image1
    let whyUs_Image2
    let missionVision_Image
    let ourStory_Image1
    let ourStory_Image2
    let ourValue_Image

    if (req.files) {
        if (req.files['Image1']) {
            const file1 = req.files['Image1'][0];
            const Image1Name = getFileNameWithoutExtension(file1.originalname);
            const customId1 = `${Image1Name}_${nanoId()}`

            // await cloudinary.uploader.destroy(about.whyUsImage1.public_id)
            // await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/whyUs/${about.whyUsImage1.customId}`)
            const { secure_url: secureUrl1, public_id: publicId1 } = await cloudinary.uploader.upload(req.files['Image1'][0].path, {
                folder: `${process.env.PROJECT_FOLDER}/whyUs/${customId1}`
            });
            whyUs_Image1 = { secure_url: secureUrl1, public_id: publicId1, customId: customId1 }
        }
        else {
            const secure_url = about.whyUsImage1.secure_url;
            const public_id = about.whyUsImage1.public_id;
            const customId = about.whyUsImage1.customId;
            whyUs_Image1 = { secure_url, public_id, customId }
        }

        if (req.files['Image2']) {
            const file2 = req.files['Image2'][0];
            const Image2Name = getFileNameWithoutExtension(file2.originalname);
            const customId2 = `${Image2Name}_${nanoId()}`

            // await cloudinary.uploader.destroy(about.whyUsImage2.public_id)
            // await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/whyUs/${about.whyUsImage2.customId}`)
            const { secure_url: secureUrl2, public_id: publicId2 } = await cloudinary.uploader.upload(req.files['Image2'][0].path, {
                folder: `${process.env.PROJECT_FOLDER}/whyUs/${customId2}`
            });
            whyUs_Image2 = { secure_url: secureUrl2, public_id: publicId2, customId: customId2 }
        }
        else {
            const secure_url = about.whyUsImage2.secure_url;
            const public_id = about.whyUsImage2.public_id;
            const customId = about.whyUsImage2.customId;
            whyUs_Image2 = { secure_url, public_id, customId }
        }

        if (req.files['missionVisionImage']) {
            const MVfile = req.files['missionVisionImage'][0];
            const MVImageName = getFileNameWithoutExtension(MVfile.originalname);
            const MVCustomId = `${MVImageName}_${nanoId()}`

            // await cloudinary.uploader.destroy(about.missionVisionImage.public_id)
            // await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/about/vision&mission/${about.missionVisionImage.customId}`)
            const { secure_url: MVImgsecureUrl, public_id: MVImgpublicId } = await cloudinary.uploader.upload(req.files['missionVisionImage'][0].path, {
                folder: `${process.env.PROJECT_FOLDER}/about/visionMission/${MVCustomId}`
            });
            missionVision_Image = { secure_url: MVImgsecureUrl, public_id: MVImgpublicId, customId: MVCustomId }
        }
        else {
            const secure_url = about.missionVisionImage.secure_url;
            const public_id = about.missionVisionImage.public_id;
            const customId = about.missionVisionImage.customId;
            missionVision_Image = { secure_url, public_id, customId }
        }

        if (req.files['ourStoryImage1']) {
            const OSfile1 = req.files['ourStoryImage1'][0];
            const OSImage1Name = getFileNameWithoutExtension(OSfile1.originalname);
            const OSCustomId1 = `${OSImage1Name}_${nanoId()}`

            // await cloudinary.uploader.destroy(about.ourStoryImage1.public_id)
            // await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/about/OurStory/${about.ourStoryImage1.customId}`)
            const { secure_url: OSImgsecureUrl1, public_id: OSImgpublicId1 } = await cloudinary.uploader.upload(req.files['ourStoryImage1'][0].path, {
                folder: `${process.env.PROJECT_FOLDER}/about/OurStory/${OSCustomId1}`
            });
            ourStory_Image1 = { secure_url: OSImgsecureUrl1, public_id: OSImgpublicId1, customId: OSCustomId1 }
        }
        else {
            const secure_url = about.ourStoryImage1.secure_url;
            const public_id = about.ourStoryImage1.public_id;
            const customId = about.ourStoryImage1.customId;
            ourStory_Image1 = { secure_url, public_id, customId }
        }

        if (req.files['ourStoryImage2']) {
            const OSfile2 = req.files['ourStoryImage2'][0];
            const OSImage2Name = getFileNameWithoutExtension(OSfile2.originalname);
            const OSCustomId2 = `${OSImage2Name}_${nanoId()}`

            // await cloudinary.uploader.destroy(about.ourStoryImage2.public_id)
            // await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/about/OurStory/${about.ourStoryImage2.customId}`)
            const { secure_url: OSImgsecureUrl2, public_id: OSImgpublicId2 } = await cloudinary.uploader.upload(req.files['ourStoryImage2'][0].path, {
                folder: `${process.env.PROJECT_FOLDER}/about/OurStory/${OSCustomId2}`
            });
            ourStory_Image2 = { secure_url: OSImgsecureUrl2, public_id: OSImgpublicId2, customId: OSCustomId2 }
        }
        else {
            const secure_url = about.ourStoryImage2.secure_url;
            const public_id = about.ourStoryImage2.public_id;
            const customId = about.ourStoryImage2.customId;
            ourStory_Image2 = { secure_url, public_id, customId }
        }

        if (req.files['ourValueImage']) {
            const OVfile = req.files['ourValueImage'][0];
            const OVImageName = getFileNameWithoutExtension(OVfile.originalname);
            const OVCustomId = `${OVImageName}_${nanoId()}`

            // await cloudinary.uploader.destroy(about.ourValueImage.public_id)
            // await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/about/OurValue/${about.ourValueImage.customId}`)
            const { secure_url: OVImgsecureUrl, public_id: OVImgpublicId } = await cloudinary.uploader.upload(req.files['ourValueImage'][0].path, {
                folder: `${process.env.PROJECT_FOLDER}/about/OurValue/${OVCustomId}`
            });
            ourValue_Image = { secure_url: OVImgsecureUrl, public_id: OVImgpublicId, customId: OVCustomId }
        }
        else {
            const secure_url = about.ourValueImage.secure_url;
            const public_id = about.ourValueImage.public_id;
            const customId = about.ourValueImage.customId;
            ourValue_Image = { secure_url, public_id, customId }
        }

    }
    
    else {
        const secure_url_whyUsImage1 = about.whyUsImage1.secure_url;
        const public_id_whyUsImage1 = about.whyUsImage1.public_id;
        const customId_whyUsImage1 = about.whyUsImage1.customId;
        whyUs_Image1 = { secure_url: secure_url_whyUsImage1, public_id: public_id_whyUsImage1, customId: customId_whyUsImage1 }

        const secure_url_whyUsImage2 = about.whyUsImage2.secure_url;
        const public_id_whyUsImage2 = about.whyUsImage2.public_id;
        const customId_whyUsImage2 = about.whyUsImage2.customId;
        whyUs_Image2 = { secure_url: secure_url_whyUsImage2, public_id: public_id_whyUsImage2, customId: customId_whyUsImage2 }

        const secure_url_missionVisionImage = about.missionVisionImage.secure_url;
        const public_id_missionVisionImage = about.missionVisionImage.public_id;
        const customId_missionVisionImage = about.missionVisionImage.customId;
        missionVision_Image = { secure_url: secure_url_missionVisionImage, public_id: public_id_missionVisionImage, customId: customId_missionVisionImage }

        const secure_url_ourStoryImage1 = about.ourStoryImage1.secure_url;
        const public_id_ourStoryImage1 = about.ourStoryImage1.public_id;
        const customId_ourStoryImage1 = about.ourStoryImage1.customId;
        ourStory_Image1 = { secure_url: secure_url_ourStoryImage1, public_id: public_id_ourStoryImage1, customId: customId_ourStoryImage1 }

        const secure_url_ourStoryImage2 = about.ourStoryImage2.secure_url;
        const public_id_ourStoryImage2 = about.ourStoryImage2.public_id;
        const customId_ourStoryImage2 = about.ourStoryImage2.customId;
        ourStory_Image2 = { secure_url: secure_url_ourStoryImage2, public_id: public_id_ourStoryImage2, customId: customId_ourStoryImage2 }

        const secure_url_ourValueImage = about.ourValueImage.secure_url;
        const public_id_ourValueImage = about.ourValueImage.public_id;
        const customId_ourValueImage = about.ourValueImage.customId;
        ourValue_Image = { secure_url: secure_url_ourValueImage, public_id: public_id_ourValueImage, customId: customId_ourValueImage }
    }

    about.mission = mission || about.mission;
    about.vission = vission || about.vission;
    about.ourStory = ourStory || about.ourStory;
    about.ourValue = ourValue || about.ourValue;
    about.whyUsTitle = whyUsTitle || about.whyUsTitle;
    about.whyUsDesc = whyUsDesc || about.whyUsDesc;
    about.metaDesc = metaDesc || about.metaDesc;
    about.metaKeyWords = metaKeyWords || about.metaKeyWords;
    about.missionTitle = missionTitle || about.missionTitle;
    about.vissionTitle = vissionTitle || about.vissionTitle;
    about.ourStoryTitle = ourStoryTitle || about.ourStoryTitle;
    about.ourValueTitle = ourValueTitle || about.ourValueTitle;
    about.whyUsSubtitle = whyUsSubtitle || about.whyUsSubtitle;
    about.howWeWorkMainTitle = howWeWorkMainTitle || about.howWeWorkMainTitle;

    whyUs_Image1.alt = whyUsImage1Alt || about.whyUsImage1.alt
    about.whyUsImage1 = whyUs_Image1;
   
    whyUs_Image2.alt = whyUsImage2Alt || about.whyUsImage2.alt
    about.whyUsImage2 = whyUs_Image2;

    missionVision_Image.alt = missionVisionAlt || about.missionVisionImage.alt
    about.missionVisionImage = missionVision_Image;

    ourStory_Image1.alt = ourStoryAlt || about.ourStoryImage1.alt
    about.ourStoryImage1 = ourStory_Image1;

    ourStory_Image2.alt = ourStoryAlt || about.ourStoryImage2.alt
    about.ourStoryImage2 = ourStory_Image2;

    ourValue_Image.alt = ourValueAlt || about.ourValueImage.alt
    about.ourValueImage = ourValue_Image;

    if (howWeWorkArr) {
        for (let i = 0; i < howWeWorkArr.length; i++) {
            let hWork = howWeWorkArr[i];

            if (req.files && req.files[`howWeWorkImage${i + 1}`]) {
                const file = req.files[`howWeWorkImage${i + 1}`][0];
                const imageName = getFileNameWithoutExtension(file.originalname);
                const customId = `${imageName}_${nanoId()}`;

                // if (about.howWeWork[i] && about.howWeWork[i].image && about.howWeWork[i].image.public_id) {
                //     await cloudinary.uploader.destroy(about.howWeWork[i].image.public_id);
                //     await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/howWeWork/${about.howWeWork[i].image.customId}`);
                // }

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
        // await cloudinary.api.delete_resources([publicId1, publicId2]);
        // await Promise.all([
        //     cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/whyUs/${customId1}`),
        //     cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/whyUs/${customId2}`)
        // ]);
        return next(new Error('update failed', { cause: 400 }))

    }
    clientRedis.del('homeData');
    clientRedis.del('aboutDashBoard');
    clientRedis.del('whyUsDataDashBoard');
    clientRedis.del('aboutWebsite');
    res.status(200).json({ message: 'Done', updatedAbout })
}

export const deleteAbout = async (req, res, next) => {
    // const { aboutId } = req.params
    const deletedAbout = await aboutModel.findOneAndDelete()
    if (!deletedAbout) {
        return next(new Error('failed to delete', { cause: 400 }))
    }
    await cloudinary.api.delete_resources([
        deletedAbout.whyUsImage1.public_id,
        deletedAbout.whyUsImage2.public_id,
        deletedAbout.missionVisionImage.public_id,
        deletedAbout.ourStoryImage1.public_id,
        deletedAbout.ourStoryImage2.public_id,
        deletedAbout.ourValueImage.public_id,

    ]);
    await Promise.all([
        cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/whyUs/${deletedAbout.whyUsImage1.customId}`),
        cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/whyUs/${deletedAbout.whyUsImage2.customId}`),

        cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/about/vision&mission/${deletedAbout.missionVisionImage.customId}`),
        cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/about/OurStory/${deletedAbout.ourStoryImage1.customId}`),
        cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/about/OurStory/${deletedAbout.ourStoryImage2.customId}`),
        cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/about/OurValue/${deletedAbout.ourValueImage.customId}`),

    ]);
    return res.status(200).json({ message: 'Done', deletedAbout })

}


export const getAbout = async (req, res, next) => {
    const about = await getOrSetCache('aboutDashBoard', async () => {
        const about = await aboutModel.findOne()
        if (!about) {
            return next(new Error('failed to get about comapny data', { cause: 400 }))
        }
        const data = { about };
        return data
    })
    return res.status(200).json({ message: 'Done', ...about })
}

export const getWhyUsData = async (req, res, next) => {
    const whyUsData = await getOrSetCache('whyUsDataDashBoard', async () => {
        const whyUsData = await aboutModel.findOne().select('-_id whyUs whyUsImage1 whyUsImage2')
        if (!whyUsData) {
            return next(new Error('failed to get why Us data', { cause: 400 }))
        }
        const data = { whyUsData }
        return data
    })
    return res.status(200).json({ message: 'Done', ...whyUsData })
}