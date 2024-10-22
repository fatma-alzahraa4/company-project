import { aboutModel } from "../../../DB/models/aboutUsModel.js"
import { customAlphabet } from 'nanoid';
import cloudinary from "../../utils/cloudinaryConfigrations.js";
import { clientRedis, getOrSetCache } from "../../utils/redis.js";
const nanoId = customAlphabet('abcdefghijklmnopqrstuvwxyz123456890', 5)
const getFileNameWithoutExtension = (filename) => {
    return filename.split('.').slice(0, -1).join('.');
};

// export const addAboutData = async (req, res, next) => {
//     const {
//         mission,
//         missionTitle,
//         vission,
//         vissionTitle,
//         ourStory,
//         ourStoryTitle,
//         ourValue,
//         ourValueTitle,
//         whyUsTitle,
//         whyUsDesc,
//         whyUsSubtitle,
//         whyUsImage1Alt,
//         whyUsImage2Alt,
//         howWeWorkMainTitle,
//         howWeWorkArr,
//         howWeWorkAlt,
//         metaDesc,
//         metaKeyWords,
//         //new
//         missionVisionAlt,
//         ourStoryAlt,
//         ourValueAlt
//     } = req.body

//     // await aboutModel.deleteMany()
//     if (!req.files['Image1']) {
//         return next(new Error('Please upload image 1', { cause: 400 }));
//     }
//     if (!req.files['Image2']) {
//         return next(new Error('Please upload image 2', { cause: 400 }));
//     }
//     if (!req.files['howWeWorkImage1']) {
//         return next(new Error('Please upload how work image 1', { cause: 400 }));
//     }
//     if (!req.files['howWeWorkImage2']) {
//         return next(new Error('Please upload how work image 2', { cause: 400 }));
//     }
//     if (!req.files['howWeWorkImage3']) {
//         return next(new Error('Please upload how work image 3', { cause: 400 }));
//     }
//     if (!req.files['howWeWorkImage4']) {
//         return next(new Error('Please upload how work image 4', { cause: 400 }));
//     }
//     //new
//     if (!req.files['missionVisionImage']) {
//         return next(new Error('Please upload mission and vision image ', { cause: 400 }));
//     }
//     if (!req.files['ourStoryImage1']) {
//         return next(new Error('Please upload Our Story Image 1', { cause: 400 }));
//     }
//     if (!req.files['ourStoryImage2']) {
//         return next(new Error('Please upload Our Story Image 2', { cause: 400 }));
//     }
//     if (!req.files['ourValueImage']) {
//         return next(new Error('Please upload Our Value Image ', { cause: 400 }));
//     }




//     const file1 = req.files['Image1'][0];
//     const file2 = req.files['Image2'][0];
//     const hwfile1 = req.files['howWeWorkImage1'][0];
//     const hwfile2 = req.files['howWeWorkImage2'][0];
//     const hwfile3 = req.files['howWeWorkImage3'][0];
//     const hwfile4 = req.files['howWeWorkImage4'][0];
//     //new
//     const MVfile = req.files['missionVisionImage'][0];
//     const OSfile1 = req.files['ourStoryImage1'][0];
//     const OSfile2 = req.files['ourStoryImage2'][0];
//     const OVfile = req.files['ourValueImage'][0];



//     const Image1Name = getFileNameWithoutExtension(file1.originalname);
//     const Image2Name = getFileNameWithoutExtension(file2.originalname);
//     const hwImage1Name = getFileNameWithoutExtension(hwfile1.originalname);
//     const hwImage2Name = getFileNameWithoutExtension(hwfile2.originalname);
//     const hwImage3Name = getFileNameWithoutExtension(hwfile3.originalname);
//     const hwImage4Name = getFileNameWithoutExtension(hwfile4.originalname);
//     //new
//     const MVImageName = getFileNameWithoutExtension(MVfile.originalname);
//     const OSImage1Name = getFileNameWithoutExtension(OSfile1.originalname);
//     const OSImage2Name = getFileNameWithoutExtension(OSfile2.originalname);
//     const OVImageName = getFileNameWithoutExtension(OVfile.originalname);


//     const customId1 = `${Image1Name}_${nanoId()}`
//     const customId2 = `${Image2Name}_${nanoId()}`
//     const hwCustomId1 = `${hwImage1Name}_${nanoId()}`
//     const hwCustomId2 = `${hwImage2Name}_${nanoId()}`
//     const hwCustomId3 = `${hwImage3Name}_${nanoId()}`
//     const hwCustomId4 = `${hwImage4Name}_${nanoId()}`
//     //new
//     const MVCustomId = `${MVImageName}_${nanoId()}`
//     const OSCustomId1 = `${OSImage1Name}_${nanoId()}`
//     const OSCustomId2 = `${OSImage2Name}_${nanoId()}`
//     const OVCustomId = `${OVImageName}_${nanoId()}`


//     const { secure_url: secureUrl1, public_id: publicId1 } = await cloudinary.uploader.upload(req.files['Image1'][0].path, {
//         folder: `${process.env.PROJECT_FOLDER}/whyUs/${customId1}`
//     });
//     const { secure_url: secureUrl2, public_id: publicId2 } = await cloudinary.uploader.upload(req.files['Image2'][0].path, {
//         folder: `${process.env.PROJECT_FOLDER}/whyUs/${customId2}`
//     });
//     const { secure_url: hwImgsecureUrl1, public_id: hwImgpublicId1 } = await cloudinary.uploader.upload(req.files['howWeWorkImage1'][0].path, {
//         folder: `${process.env.PROJECT_FOLDER}/howWeWork/${hwCustomId1}`
//     });
//     const { secure_url: hwImgsecureUrl2, public_id: hwImgpublicId2 } = await cloudinary.uploader.upload(req.files['howWeWorkImage2'][0].path, {
//         folder: `${process.env.PROJECT_FOLDER}/howWeWork/${hwCustomId2}`
//     });
//     const { secure_url: hwImgsecureUrl3, public_id: hwImgpublicId3 } = await cloudinary.uploader.upload(req.files['howWeWorkImage3'][0].path, {
//         folder: `${process.env.PROJECT_FOLDER}/howWeWork/${hwCustomId3}`
//     });
//     const { secure_url: hwImgsecureUrl4, public_id: hwImgpublicId4 } = await cloudinary.uploader.upload(req.files['howWeWorkImage4'][0].path, {
//         folder: `${process.env.PROJECT_FOLDER}/howWeWork/${hwCustomId4}`
//     });

//     //new
//     const { secure_url: MVImgsecureUrl, public_id: MVImgpublicId } = await cloudinary.uploader.upload(req.files['missionVisionImage'][0].path, {
//         folder: `${process.env.PROJECT_FOLDER}/about/visionMission/${MVCustomId}`
//     });
//     const { secure_url: OSImgsecureUrl1, public_id: OSImgpublicId1 } = await cloudinary.uploader.upload(req.files['ourStoryImage1'][0].path, {
//         folder: `${process.env.PROJECT_FOLDER}/about/OurStory/${OSCustomId1}`
//     });
//     const { secure_url: OSImgsecureUrl2, public_id: OSImgpublicId2 } = await cloudinary.uploader.upload(req.files['ourStoryImage2'][0].path, {
//         folder: `${process.env.PROJECT_FOLDER}/about/OurStory/${OSCustomId2}`
//     });
//     const { secure_url: OVImgsecureUrl, public_id: OVImgpublicId } = await cloudinary.uploader.upload(req.files['ourValueImage'][0].path, {
//         folder: `${process.env.PROJECT_FOLDER}/about/OurValue/${OVCustomId}`
//     });

//     req.imagePaths = {
//         image1: `${process.env.PROJECT_FOLDER}/whyUs/${customId1}`,
//         image2: `${process.env.PROJECT_FOLDER}/whyUs/${customId2}`,
//         hwImage1: `${process.env.PROJECT_FOLDER}/howWeWork/${hwCustomId1}`,
//         hwImage2: `${process.env.PROJECT_FOLDER}/howWeWork/${hwCustomId2}`,
//         hwImage3: `${process.env.PROJECT_FOLDER}/howWeWork/${hwCustomId3}`,
//         hwImage4: `${process.env.PROJECT_FOLDER}/howWeWork/${hwCustomId4}`,

//     };


//     let howArr = [];
//     if (howWeWorkArr && howWeWorkArr.length) {
//         const imageUrls = [
//             { secure_url: hwImgsecureUrl1, public_id: hwImgpublicId1, customId: hwCustomId1, alt: howWeWorkAlt },
//             { secure_url: hwImgsecureUrl2, public_id: hwImgpublicId2, customId: hwCustomId2, alt: howWeWorkAlt },
//             { secure_url: hwImgsecureUrl3, public_id: hwImgpublicId3, customId: hwCustomId3, alt: howWeWorkAlt },
//             { secure_url: hwImgsecureUrl4, public_id: hwImgpublicId4, customId: hwCustomId4, alt: howWeWorkAlt }
//         ];

//         for (let i = 0; i < howWeWorkArr.length; i++) {
//             let hWork = howWeWorkArr[i];
//             hWork.image = imageUrls[i];

//             howArr.push({
//                 title: hWork.title,
//                 desc: hWork.desc,
//                 image: hWork.image
//             });
//         }
//     }

//     const aboutObj = {
//         mission,
//         missionTitle,
//         vission,
//         vissionTitle,
//         ourStory,
//         ourStoryTitle,
//         ourValue,
//         ourValueTitle,
//         whyUsTitle,
//         whyUsDesc,
//         whyUsSubtitle,
//         metaDesc,
//         metaKeyWords,
//         howWeWorkMainTitle,
//         howWeWork: howArr,
//         whyUsImage1: { secure_url: secureUrl1, public_id: publicId1, customId: customId1, alt: whyUsImage1Alt },
//         whyUsImage2: { secure_url: secureUrl2, public_id: publicId2, customId: customId2, alt: whyUsImage2Alt },
//         //neww
//         missionVisionImage: { secure_url: MVImgsecureUrl, public_id: MVImgpublicId, customId: MVCustomId, alt: missionVisionAlt },
//         ourStoryImage1: { secure_url: OSImgsecureUrl1, public_id: OSImgpublicId1, customId: OSCustomId1, alt: ourStoryAlt },
//         ourStoryImage2: { secure_url: OSImgsecureUrl2, public_id: OSImgpublicId2, customId: OSCustomId2, alt: ourStoryAlt },
//         ourValueImage: { secure_url: OVImgsecureUrl, public_id: OVImgpublicId, customId: OVCustomId, alt: ourValueAlt },

//     }
//     const newAbout = await aboutModel.create(aboutObj)
//     if (!newAbout) {
//         await cloudinary.api.delete_resources([publicId1, publicId2]);
//         await Promise.all([
//             cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/whyUs/${newAbout.whyUsImage1.customId}`),
//             cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/whyUs/${newAbout.whyUsImage2.customId}`)
//         ]);
//         return next(new Error('creation failed', { cause: 400 }))
//     }
//     res.status(200).json({ message: 'Done', newAbout })

// }

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

    if (howWeWorkArr) {
        for (let i = 0; i < howWeWorkArr.length; i++) {
            let hWork = howWeWorkArr[i];

            if (req.files && req.files[`howWeWorkImage${i + 1}`]) {
                const file = req.files[`howWeWorkImage${i + 1}`][0];
                const imageName = getFileNameWithoutExtension(file.originalname);
                const customId = `${imageName}_${nanoId()}`;

                const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
                    folder: `${process.env.PROJECT_FOLDER}/howWeWork/${customId}`
                });

                hWork.image = {
                    secure_url: secure_url,
                    public_id: public_id,
                    customId: customId,
                    alt: howWeWorkAlt
                };

                uploadedPublicIds.push(public_id);
                uploadedFolders.push(`${process.env.PROJECT_FOLDER}/howWeWork/${customId}`);

            } else if (about.howWeWork[i]) {
                hWork.image = about.howWeWork[i].image;
            }
            hWork.title = hWork.title || about.howWeWork[i].title;
            hWork.desc = hWork.desc || about.howWeWork[i].desc;
        }
        about.howWeWork = howWeWorkArr;
    }

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


// Function to handle image processing


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

    // Attempt to delete associated folders from Cloudinary
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
    //not use but for me
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