import { companyModel } from "../../../DB/models/CompanyModel.js"
import { customAlphabet } from 'nanoid';
import cloudinary from "../../utils/cloudinaryConfigrations.js";
import moment from 'moment';
const nanoId = customAlphabet('abcdefghijklmnopqrstuvwxyz123456890', 5)

const getFileNameWithoutExtension = (filename) => {
    return filename.split('.').slice(0, -1).join('.');
  };

export const addCompanyData = async (req, res, next) => {
    const {
        companyName,
        email,
        phoneNum,
        landLine,
        mapLink,
        Facebook,
        Instagram,
        Twitter,
        Linkedin,
        SnapChat,
        Tiktok,
        altLogo,
        altContact,
        metaDesc,
        metaKeyWords,
        address,
        slogan
    } = req.body
    if (!companyName || !phoneNum || !email) {
        return next(new Error('Please enter all required data', { cause: 400 }))
    }
    // await companyModel.deleteMany()

    if (!req.files['logo']) {
        return next(new Error('Please upload company logo', { cause: 400 }));
    }
    if (!req.files['contactUsImage']) {
        return next(new Error('Please upload contact us image', { cause: 400 }));
    }

    const file1 = req.files['logo'][0];
    const file2 = req.files['contactUsImage'][0];

    const logoName = getFileNameWithoutExtension(file1.originalname);
    const contactImageName = getFileNameWithoutExtension(file2.originalname);
    // const customId = `${fileName}_${moment().format('DD/MM/YYYY/_HH:mm:ss')}`;
    const customId1 = `${logoName}_${nanoId()}`
    const customId2 = `${contactImageName}_${nanoId()}`
    const { secure_url: secureUrl1, public_id: publicId1 } = await cloudinary.uploader.upload(req.files['logo'][0].path, {
        folder: `${process.env.PROJECT_FOLDER}/Company/${customId1}`
    });
    const { secure_url: secureUrl2, public_id: publicId2 } = await cloudinary.uploader.upload(req.files['contactUsImage'][0].path, {
        folder: `${process.env.PROJECT_FOLDER}/contactImages/${customId2}`
    });

    req.imagePaths = {
        logo: `${process.env.PROJECT_FOLDER}/Company/${customId1}`,
        contactImage: `${process.env.PROJECT_FOLDER}/contactImages/${customId2}`
    };
    
    

    const companyObj = {
        companyName,
        email,
        phoneNum,
        landLine,
        mapLink,
        logo: { secure_url:secureUrl1, public_id:publicId1, alt :altLogo ,customId:customId1},
        Facebook,
        Instagram,
        Twitter,
        Linkedin,
        SnapChat,
        Tiktok,
        metaDesc,
        metaKeyWords,
        address,
        slogan,
        contactUsImage: { secure_url:secureUrl2, public_id:publicId2, alt :altContact ,customId:customId2},

    }
    const newCompany = await companyModel.create(companyObj)
    if (!newCompany) {
        // console.log("creation failed");
        return next(new Error('creation failed', { cause: 400 }))
    }
    // console.log(newCompany);
    res.status(200).json({ message: 'Done', newCompany })

}


export const editCompanyData = async (req, res, next) => {
    const {
        companyName,
        email,
        phoneNum,
        landLine,
        mapLink,
        Facebook,
        Instagram,
        Twitter,
        Linkedin,
        SnapChat,
        Tiktok,
        altLogo,
        altContact,
        metaDesc,
        metaKeyWords,
        address,
        slogan
    } = req.body
    const company = await companyModel.findOne()
    if (!company) {
        return next(new Error('no company exist', { cause: 400 }))
    }

    let Company_logo
    let contact_Image
    if (req.files) {
        if (req.files['logo']) {
            const file1 = req.files['logo'][0];
            const logoName = getFileNameWithoutExtension(file1.originalname);
            const customId1 = `${logoName}_${nanoId()}`

            await cloudinary.uploader.destroy(company.logo.public_id)
            await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Company/${company.logo.customId}`)
            const { secure_url: secureUrl1, public_id: publicId1 } = await cloudinary.uploader.upload(req.files['logo'][0].path, {
                folder: `${process.env.PROJECT_FOLDER}/Company/${customId1}`
            });
            Company_logo = { secure_url: secureUrl1, public_id: publicId1, customId: customId1 }
        }
        else {
            Company_logo = company.logo
        }
        if (req.files['contactUsImage']) {
            const file2 = req.files['contactUsImage'][0];
            const contactImageName = getFileNameWithoutExtension(file2.originalname);
            const customId2 = `${contactImageName}_${nanoId()}`

            await cloudinary.uploader.destroy(company.contactUsImage.public_id)
            await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/contactImages/${company.contactUsImage.customId}`)
            const { secure_url: secureUrl2, public_id: publicId2 } = await cloudinary.uploader.upload(req.files['contactUsImage'][0].path, {
                folder: `${process.env.PROJECT_FOLDER}/contactImages/${customId2}`
            });
            contact_Image = { secure_url: secureUrl2, public_id: publicId2, customId: customId2 }
        }
        else {
            contact_Image = company.contactUsImage
        }
    }
    else{
        Company_logo = company.logo
        contact_Image = company.contactUsImage
    }

    if (!companyName) {
        company.companyName = company.companyName
    }
    else {
        company.companyName = companyName
    }
    if (!email) {
        company.email = company.email
    }
    else {
        company.email = email
    }
    if (!phoneNum) {
        company.phoneNum = company.phoneNum
    }
    else {
        company.phoneNum = phoneNum
    }
    if (!landLine) {
        company.landLine = company.landLine
    }
    else {
        company.landLine = landLine
    }
    if (!mapLink) {
        company.mapLink = company.mapLink
    }
    else {
        company.mapLink = mapLink
    }
    if (!Facebook) {
        company.Facebook = company.Facebook
    }
    else {
        company.Facebook = Facebook
    }
    if (!Instagram) {
        company.Instagram = company.Instagram
    }
    else {
        company.Instagram = Instagram
    }
    if (!Twitter) {
        company.Twitter = company.Twitter
    }
    else {
        company.Twitter = Twitter
    }
    if (!SnapChat) {
        company.SnapChat = company.SnapChat
    }
    else {
        company.SnapChat = SnapChat
    }
    if (!Linkedin) {
        company.Linkedin = company.Linkedin
    }
    else {
        company.Linkedin = Linkedin
    }
    if (!Tiktok) {
        company.Tiktok = company.Tiktok
    }
    else {
        company.Tiktok = Tiktok
    }
    if (!metaDesc) {
        company.metaDesc = company.metaDesc
    }
    else {
        company.metaDesc = metaDesc
    }
    if (!metaKeyWords) {
        company.metaKeyWords = company.metaKeyWords
    }
    else {
        company.metaKeyWords = metaKeyWords
    }
    if(address){
        company.address = address
    }
    if (!altLogo) {
        const sameAlt = company.logo.alt
        // console.log(sameAlt);
        company.logo = {...Company_logo,alt:sameAlt}
    }
    else {
        company.logo = {...Company_logo,alt:altLogo}
    }
    if (!altContact) {
        const sameAlt = company.contactUsImage.alt
        // console.log(sameAlt);
        company.contactUsImage = {...contact_Image,alt:sameAlt}
    }
    else {
        company.contactUsImage = {...contact_Image,alt:altContact}
    }
    company.slogan = slogan || company.slogan



    const updatedCompany = await company.save()
    if (!updatedCompany) {
        await cloudinary.uploader.destroy(public_id)
        await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Company/${customId}`)
        return next(new Error('update failed', { cause: 400 }))

    }
    res.status(200).json({ message: 'Done', updatedCompany })
}

export const deleteCompany = async (req, res, next) => {
    // const { companyId } = req.params
    // const company = await companyModel.findById(companyId)
    const deletedCompany = await companyModel.findOneAndDelete()
    if (!deletedCompany) {
        return next(new Error('failed to delete', { cause: 400 }))
    }
    await cloudinary.uploader.destroy(deletedCompany.logo.public_id)
    await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Company/${deletedCompany.customId}`)
    return res.status(200).json({ message: 'Done', deletedCompany })

}


export const getCompany = async (req, res, next) => {
    const company = await companyModel.findOne()
    if (!company) {
        return next(new Error('failed to get company data', { cause: 400 }))
    }
    return res.status(200).json({ message: 'Done', company })
}