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
        missionVisionAlt,
        ourStoryAlt,
        ourValueAlt
    } = req.body;

    const requiredInputs = [
        'mission',
        'missionTitle',
        'vission',
        'vissionTitle',
        'ourStory',
        'ourStoryTitle',
        'ourValue',
        'ourValueTitle',
        'whyUsTitle',
        'whyUsDesc',
        'whyUsSubtitle',
        'whyUsImage1Alt',
        'whyUsImage2Alt',
        'howWeWorkMainTitle',
        'howWeWorkArr',
        'howWeWorkAlt',
        'metaDesc',
        'missionVisionAlt',
        'ourStoryAlt',
        'ourValueAlt'
    ];
    requiredInputs.forEach(input => {
        if (!req.body[`${input}`]) {
            return next(new Error(`Missing required field: ${input}`, { cause: 400 }));
        }
    });

    const requiredFiles = [
        'Image1',
        'Image2',
        'howWeWorkImage1',
        'howWeWorkImage2',
        'howWeWorkImage3',
        'howWeWorkImage4',
        'missionVisionImage',
        'ourStoryImage1',
        'ourStoryImage2',
        'ourValueImage'
    ];

    requiredFiles.forEach(fileKey => {
        if (!req.files[fileKey]) {
            return next(new Error(`Missing required file: ${fileKey}`, { cause: 400 }));
        }
    });

    const fileRefs = {
        file1: req.files['Image1'][0],
        file2: req.files['Image2'][0],
        hwfile1: req.files['howWeWorkImage1'][0],
        hwfile2: req.files['howWeWorkImage2'][0],
        hwfile3: req.files['howWeWorkImage3'][0],
        hwfile4: req.files['howWeWorkImage4'][0],
        MVfile: req.files['missionVisionImage'][0],
        OSfile1: req.files['ourStoryImage1'][0],
        OSfile2: req.files['ourStoryImage2'][0],
        OVfile: req.files['ourValueImage'][0]
    };

    const customIds = {
        Image1Name: getFileNameWithoutExtension(fileRefs.file1.originalname),
        Image2Name: getFileNameWithoutExtension(fileRefs.file2.originalname),
        hwImage1Name: getFileNameWithoutExtension(fileRefs.hwfile1.originalname),
        hwImage2Name: getFileNameWithoutExtension(fileRefs.hwfile2.originalname),
        hwImage3Name: getFileNameWithoutExtension(fileRefs.hwfile3.originalname),
        hwImage4Name: getFileNameWithoutExtension(fileRefs.hwfile4.originalname),
        MVImageName: getFileNameWithoutExtension(fileRefs.MVfile.originalname),
        OSImage1Name: getFileNameWithoutExtension(fileRefs.OSfile1.originalname),
        OSImage2Name: getFileNameWithoutExtension(fileRefs.OSfile2.originalname),
        OVImageName: getFileNameWithoutExtension(fileRefs.OVfile.originalname),
    };

    const customIdsGenerated = {
        customId1: `${customIds.Image1Name}_${nanoId()}`,
        customId2: `${customIds.Image2Name}_${nanoId()}`,
        hwCustomId1: `${customIds.hwImage1Name}_${nanoId()}`,
        hwCustomId2: `${customIds.hwImage2Name}_${nanoId()}`,
        hwCustomId3: `${customIds.hwImage3Name}_${nanoId()}`,
        hwCustomId4: `${customIds.hwImage4Name}_${nanoId()}`,
        MVCustomId: `${customIds.MVImageName}_${nanoId()}`,
        OSCustomId1: `${customIds.OSImage1Name}_${nanoId()}`,
        OSCustomId2: `${customIds.OSImage2Name}_${nanoId()}`,
        OVCustomId: `${customIds.OVImageName}_${nanoId()}`,
    };

    const uploadPromises = [
        cloudinary.uploader.upload(fileRefs.file1.path, { folder: `${process.env.PROJECT_FOLDER}/whyUs/${customIdsGenerated.customId1}` }),
        cloudinary.uploader.upload(fileRefs.file2.path, { folder: `${process.env.PROJECT_FOLDER}/whyUs/${customIdsGenerated.customId2}` }),
        cloudinary.uploader.upload(fileRefs.hwfile1.path, { folder: `${process.env.PROJECT_FOLDER}/howWeWork/${customIdsGenerated.hwCustomId1}` }),
        cloudinary.uploader.upload(fileRefs.hwfile2.path, { folder: `${process.env.PROJECT_FOLDER}/howWeWork/${customIdsGenerated.hwCustomId2}` }),
        cloudinary.uploader.upload(fileRefs.hwfile3.path, { folder: `${process.env.PROJECT_FOLDER}/howWeWork/${customIdsGenerated.hwCustomId3}` }),
        cloudinary.uploader.upload(fileRefs.hwfile4.path, { folder: `${process.env.PROJECT_FOLDER}/howWeWork/${customIdsGenerated.hwCustomId4}` }),
        cloudinary.uploader.upload(fileRefs.MVfile.path, { folder: `${process.env.PROJECT_FOLDER}/about/visionMission/${customIdsGenerated.MVCustomId}` }),
        cloudinary.uploader.upload(fileRefs.OSfile1.path, { folder: `${process.env.PROJECT_FOLDER}/about/OurStory/${customIdsGenerated.OSCustomId1}` }),
        cloudinary.uploader.upload(fileRefs.OSfile2.path, { folder: `${process.env.PROJECT_FOLDER}/about/OurStory/${customIdsGenerated.OSCustomId2}` }),
        cloudinary.uploader.upload(fileRefs.OVfile.path, { folder: `${process.env.PROJECT_FOLDER}/about/OurValue/${customIdsGenerated.OVCustomId}` }),
    ];

    const uploadResults = await Promise.all(uploadPromises);

    const [
        { secure_url: secureUrl1, public_id: publicId1 },
        { secure_url: secureUrl2, public_id: publicId2 },
        { secure_url: hwImgsecureUrl1, public_id: hwImgpublicId1 },
        { secure_url: hwImgsecureUrl2, public_id: hwImgpublicId2 },
        { secure_url: hwImgsecureUrl3, public_id: hwImgpublicId3 },
        { secure_url: hwImgsecureUrl4, public_id: hwImgpublicId4 },
        { secure_url: MVImgsecureUrl, public_id: MVImgpublicId },
        { secure_url: OSImgsecureUrl1, public_id: OSImgpublicId1 },
        { secure_url: OSImgsecureUrl2, public_id: OSImgpublicId2 },
        { secure_url: OVImgsecureUrl, public_id: OVImgpublicId }
    ] = uploadResults;

    const howArr = howWeWorkArr?.length ? howWeWorkArr.map((hWork, i) => ({
        title: hWork.title,
        desc: hWork.desc,
        image: {
            secure_url: uploadResults[i + 2].secure_url,
            public_id: uploadResults[i + 2].public_id,
            customId: customIdsGenerated[`hwCustomId${i + 1}`],
            alt: howWeWorkAlt
        },
    })) : [];

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
        whyUsImage1: { secure_url: secureUrl1, public_id: publicId1, customId: customIdsGenerated.customId1, alt: whyUsImage1Alt },
        whyUsImage2: { secure_url: secureUrl2, public_id: publicId2, customId: customIdsGenerated.customId2, alt: whyUsImage2Alt },
        missionVisionImage: { secure_url: MVImgsecureUrl, public_id: MVImgpublicId, customId: customIdsGenerated.MVCustomId, alt: missionVisionAlt },
        ourStoryImage1: { secure_url: OSImgsecureUrl1, public_id: OSImgpublicId1, customId: customIdsGenerated.OSCustomId1, alt: ourStoryAlt },
        ourStoryImage2: { secure_url: OSImgsecureUrl2, public_id: OSImgpublicId2, customId: customIdsGenerated.OSCustomId2, alt: ourStoryAlt },
        ourValueImage: { secure_url: OVImgsecureUrl, public_id: OVImgpublicId, customId: customIdsGenerated.OVCustomId, alt: ourValueAlt }
    };
    const uploadedPublicIDs = [
        publicId1,
        publicId2,
        hwImgpublicId1,
        hwImgpublicId2,
        hwImgpublicId3,
        hwImgpublicId4,
        MVImgpublicId,
        OSImgpublicId1,
        OSImgpublicId2,
        OVImgpublicId
    ];

    const uploadedFolders = [
        `${process.env.PROJECT_FOLDER}/whyUs/${customIdsGenerated.customId1}`,
        `${process.env.PROJECT_FOLDER}/whyUs/${customIdsGenerated.customId2}`,
        `${process.env.PROJECT_FOLDER}/howWeWork/${customIdsGenerated.hwCustomId1}`,
        `${process.env.PROJECT_FOLDER}/howWeWork/${customIdsGenerated.hwCustomId2}`,
        `${process.env.PROJECT_FOLDER}/howWeWork/${customIdsGenerated.hwCustomId3}`,
        `${process.env.PROJECT_FOLDER}/howWeWork/${customIdsGenerated.hwCustomId4}`,
        `${process.env.PROJECT_FOLDER}/about/visionMission/${customIdsGenerated.MVCustomId}`,
        `${process.env.PROJECT_FOLDER}/about/OurStory/${customIdsGenerated.OSCustomId1}`,
        `${process.env.PROJECT_FOLDER}/about/OurStory/${customIdsGenerated.OSCustomId2}`,
        `${process.env.PROJECT_FOLDER}/about/OurValue/${customIdsGenerated.OVCustomId}`
    ];

    const newAbout = await aboutModel.create(aboutObj);
    if (!newAbout) {
        await cloudinary.api.delete_resources(uploadedPublicIDs);
        await Promise.all(uploadedFolders.map(folder => cloudinary.api.delete_folder(folder)));
        return next(new Error('Failed to create about', { cause: 400 }));
    }
    clientRedis.del('homeData');
    clientRedis.del('aboutDashBoard');
    clientRedis.del('whyUsDataDashBoard');
    clientRedis.del('aboutWebsite');
    clientRedis.del('howWeWorkDashBoard');


    return res.status(200).json({ message: 'Done', newAbout });
};

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
        metaDesc,
        metaKeyWords,
        //new
        missionVisionAlt,
        ourStoryAlt,
        ourValueAlt
    } = req.body

    const about = await aboutModel.findOne()
    if (!about) {
        return next(new Error('No about found in the database. Please ensure that the about exists.', { cause: 404 }))
    }
    let whyUs_Image1, whyUs_Image2, missionVision_Image, ourStory_Image1, ourStory_Image2, ourValue_Image
    let uploadedPublicIds = [];
    let uploadedFolders = [];


    if (req.files) {
        if (req.files['Image1']) {
            const file1 = req.files['Image1'][0];
            const Image1Name = getFileNameWithoutExtension(file1.originalname);
            const customId1 = `${Image1Name}_${nanoId()}`

            await cloudinary.uploader.destroy(about.whyUsImage1.public_id)
            const [deletedVideo, { secure_url: secureUrl1, public_id: publicId1 }] = await Promise.all([
                await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/whyUs/${about.whyUsImage1.customId}`),
                cloudinary.uploader.upload(req.files['Image1'][0].path, {
                    folder: `${process.env.PROJECT_FOLDER}/whyUs/${customId1}`
                }),
            ])
            uploadedPublicIds.push(publicId1);
            uploadedFolders.push(`${process.env.PROJECT_FOLDER}/whyUs/${customId1}`);

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

            await cloudinary.uploader.destroy(about.whyUsImage2.public_id)
            const [deletedFolder, { secure_url: secureUrl2, public_id: publicId2 }] = await Promise.all([
                cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/whyUs/${about.whyUsImage2.customId}`),
                cloudinary.uploader.upload(req.files['Image2'][0].path, {
                    folder: `${process.env.PROJECT_FOLDER}/whyUs/${customId2}`
                }),
            ])
            uploadedPublicIds.push(publicId2);
            uploadedFolders.push(`${process.env.PROJECT_FOLDER} / whyUs / ${customId2}`);
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

            await cloudinary.uploader.destroy(about.missionVisionImage.public_id)
            const [deletedFolder, { secure_url: MVImgsecureUrl, public_id: MVImgpublicId }] = await Promise.all([
                cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/about/visionMission/${about.missionVisionImage.customId}`),
                cloudinary.uploader.upload(req.files['missionVisionImage'][0].path, {
                    folder: `${process.env.PROJECT_FOLDER}/about/visionMission/${MVCustomId}`
                }),
            ])
            uploadedPublicIds.push(MVImgpublicId);
            uploadedFolders.push(`${process.env.PROJECT_FOLDER}/about/visionMission/${MVCustomId}`);
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

            await cloudinary.uploader.destroy(about.ourStoryImage1.public_id)
            const [deletedFolder, { secure_url: OSImgsecureUrl1, public_id: OSImgpublicId1 }] = await Promise.all([
                cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/about/OurStory/${about.ourStoryImage1.customId}`),
                cloudinary.uploader.upload(req.files['ourStoryImage1'][0].path, {
                    folder: `${process.env.PROJECT_FOLDER}/about/OurStory/${OSCustomId1}`
                }),
            ])
            uploadedPublicIds.push(OSImgpublicId1);
            uploadedFolders.push(`${process.env.PROJECT_FOLDER}/about/OurStory/${OSCustomId1}`);
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

            await cloudinary.uploader.destroy(about.ourStoryImage2.public_id)
            const [deletedFolder, { secure_url: OSImgsecureUrl2, public_id: OSImgpublicId2 }] = await Promise.all([
                cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/about/OurStory/${about.ourStoryImage2.customId}`),
                cloudinary.uploader.upload(req.files['ourStoryImage2'][0].path, {
                    folder: `${process.env.PROJECT_FOLDER}/about/OurStory/${OSCustomId2}`
                }),
            ])
            uploadedPublicIds.push(OSImgpublicId2);
            uploadedFolders.push(`${process.env.PROJECT_FOLDER}/about/OurStory/${OSCustomId2}`);
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

            await cloudinary.uploader.destroy(about.ourValueImage.public_id)
            const [deletedFolder, { secure_url: OVImgsecureUrl, public_id: OVImgpublicId }] = await Promise.all([
                cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/about/OurValue/${about.ourValueImage.customId}`),
                cloudinary.uploader.upload(req.files['ourValueImage'][0].path, {
                    folder: `${process.env.PROJECT_FOLDER}/about/OurValue/${OVCustomId}`
                }),
            ])
            uploadedPublicIds.push(OVImgpublicId);
            uploadedFolders.push(`${process.env.PROJECT_FOLDER}/about/OurValue/${OVCustomId}`);
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


    const updatedAbout = await about.save()
    if (!updatedAbout) {
        if (uploadedPublicIds.length > 0) {
            await cloudinary.api.delete_resources(uploadedPublicIds);
        }
        if (uploadedFolders.length > 0) {
            await Promise.all(uploadedFolders.map(folder => cloudinary.api.delete_folder(folder)));
        }
        return next(new Error('Failed to update about data. Please try again later', { cause: 400 }))

    }
    clientRedis.del('homeData');
    clientRedis.del('aboutDashBoard');
    clientRedis.del('whyUsDataDashBoard');
    clientRedis.del('aboutWebsite');

    res.status(200).json({ message: 'Done', updatedAbout })
}

export const deleteAbout = async (req, res, next) => {
    const deletedAbout = await aboutModel.findOneAndDelete()
    if (!deletedAbout) {
        return next(new Error('No about data found to delete. Please try again later.', { cause: 400 }))
    }
    try {
        await cloudinary.api.delete_resources([
            deletedAbout.whyUsImage1.public_id,
            deletedAbout.whyUsImage2.public_id,
            deletedAbout.missionVisionImage.public_id,
            deletedAbout.ourStoryImage1.public_id,
            deletedAbout.ourStoryImage2.public_id,
            deletedAbout.ourValueImage.public_id,
        ]);
    } catch (error) {
        return next(new Error('Error occurred while deleting resources from Cloudinary. Please try again later.', { cause: 400 }));
    }

    try {
        await Promise.all([
            cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/whyUs/${deletedAbout.whyUsImage1.customId}`),
            cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/whyUs/${deletedAbout.whyUsImage2.customId}`),
            cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/about/visionMission/${deletedAbout.missionVisionImage.customId}`),
            cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/about/OurStory/${deletedAbout.ourStoryImage1.customId}`),
            cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/about/OurStory/${deletedAbout.ourStoryImage2.customId}`),
            cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/about/OurValue/${deletedAbout.ourValueImage.customId}`),
        ]);
    } catch (error) {
        return next(new Error('Error occurred while deleting folders from Cloudinary. Please try again later.', { cause: 400 }));
    }
    clientRedis.del('homeData');
    clientRedis.del('aboutDashBoard');
    clientRedis.del('whyUsDataDashBoard');
    clientRedis.del('aboutWebsite');
    return res.status(200).json({ message: 'Done' })

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

export const getHowWeWork = async (req, res, next) => {
        const howWeWorkData = await getOrSetCache('howWeWorkDashBoard', async () => {
            const aboutData = await aboutModel.findOne().select('-_id howWeWork');
            if (!aboutData) {
                throw new Error('Failed to get How We Work data');
            }
            return aboutData.howWeWork;
        });

        return res.status(200).json({ message: 'Done', howWeWork: howWeWorkData });
};


export const addHowWeWork = async (req, res, next) => {
    const { title, desc, altImage } = req.body
    const requiredInputs = [
        'title',
        'desc',
        'altImage'
    ];
    requiredInputs.forEach(input => {
        if (!req.body[`${input}`]) {
            return next(new Error(`Missing required field: ${input}`, { cause: 400 }));
        }
    });
    if (!req.file) {
        return next(new Error('Please upload how we work image', { cause: 400 }))
    }
    const fileName = getFileNameWithoutExtension(req.file.originalname);
    const customId = `${fileName}_${nanoId()}`;
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
        { folder: `${process.env.PROJECT_FOLDER}/howWeWork/${customId}` }
    )
    let uploadedPublicId = public_id;
    let uploadedFolder = `${process.env.PROJECT_FOLDER}/howWeWork/${customId}`;
    const imageData = { secure_url, public_id, alt: altImage, customId }
    const updatedAbout = await aboutModel.findOneAndUpdate(
        {},
        { $push: { howWeWork: { title, desc, image: imageData } } },
        { new: true }
    );
    if (!updatedAbout) {
        await cloudinary.uploader.destroy(uploadedPublicId);
        await cloudinary.api.delete_folder(uploadedFolder);

        return next(new Error('Failed to add how we work data. Please try again later', { cause: 400 }))
    }
    clientRedis.del('homeData');
    clientRedis.del('aboutDashBoard');
    clientRedis.del('aboutWebsite');
    clientRedis.del('howWeWorkDashBoard');

    res.status(200).json({ message: 'Done', updatedAbout })
}

export const editHowWeWork = async (req, res, next) => {
    const { howWeWorkId } = req.params;
    const { title, desc, altImage } = req.body;

    let howWeWork_Image = null;

    // Find the document
    const aboutDocument = await aboutModel.findOne({ "howWeWork._id": howWeWorkId });
    if (!aboutDocument) {
        return next(new Error('HowWeWork element not found.', { cause: 404 }));
    }

    // Find the target element in the array
    const targetElement = aboutDocument.howWeWork.find(item => item._id.toString() === howWeWorkId);
    if (!targetElement) {
        return next(new Error('HowWeWork element not found.', { cause: 404 }));
    }
    console.log("1", targetElement);

    // Update image if a new file is provided
    if (req.file) {
        const imageName = getFileNameWithoutExtension(req.file.originalname);
        const customId = `${imageName}_${nanoId()}`;

        // Delete the old image from Cloudinary
        await cloudinary.uploader.destroy(targetElement.image.public_id);

        // Upload the new image
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.PROJECT_FOLDER}/howWeWork/${customId}`
        });

        howWeWork_Image = {
            secure_url,
            public_id,
            customId,
            alt: altImage || targetElement.image.alt

        };

        targetElement.image = howWeWork_Image; // Update the image in the target element
    }

    // Update other fields
    if (title) targetElement.title = title;
    if (desc) targetElement.desc = desc;
    console.log("2", targetElement);

    // Save the updated document
    const updatedAbout = await aboutDocument.save();

    // Clear Redis cache
    clientRedis.del('homeData');
    clientRedis.del('aboutDashBoard');
    clientRedis.del('aboutWebsite');
    clientRedis.del('howWeWorkDashBoard');

    if (!updatedAbout) {
        if (howWeWork_Image) {
            await cloudinary.uploader.destroy(howWeWork_Image.public_id);
            await cloudinary.api.delete_folder(howWeWork_Image.customId);
        }
        return next(new Error('Failed to edit how we work data. Please try again later', { cause: 400 }))
    }
    res.status(200).json({ message: 'Done', updatedAbout: aboutDocument });
};

export const deleteHowWeWork = async (req, res, next) => {
    const { howWeWorkId } = req.params;

    // Find the parent document that contains the howWeWork element
    const aboutDocument = await aboutModel.findOne({ "howWeWork._id": howWeWorkId });
    if (!aboutDocument) {
        return next(new Error('HowWeWork element not found.', { cause: 404 }));
    }

    // Locate the target element for cleanup (e.g., image removal)
    const targetElement = aboutDocument.howWeWork.find(item => item._id.toString() === howWeWorkId);
    if (!targetElement) {
        return next(new Error('HowWeWork element not found.', { cause: 404 }));
    }

    // Remove associated image from Cloudinary
    await cloudinary.uploader.destroy(targetElement.image.public_id);
    await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/howWeWork/${targetElement.image.customId}`);

    // Remove the howWeWork element
    const updatedAbout = await aboutModel.findOneAndUpdate(
        { "howWeWork._id": howWeWorkId },
        { $pull: { howWeWork: { _id: howWeWorkId } } },
        { new: true }
    );

    if (!updatedAbout) {
        return next(new Error('Failed to delete HowWeWork element. Please try again.', { cause: 400 }));
    }

    // Clear Redis cache
    clientRedis.del('homeData');
    clientRedis.del('aboutDashBoard');
    clientRedis.del('aboutWebsite');
    clientRedis.del('howWeWorkDashBoard');

    res.status(200).json({ message: 'Done', updatedAbout });
};