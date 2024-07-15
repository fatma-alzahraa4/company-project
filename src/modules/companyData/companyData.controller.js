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
        metaDesc,
        metaKeyWords,
    } = req.body
    if (!companyName || !phoneNum || !email) {
        return next(new Error('Please enter all required data', { cause: 400 }))
    }
    // const isCompanyExist = await companyModel.findOne(
    //     {
    //         $or:
    //             [
    //                 { companyName },
    //                 { email },
    //                 { phoneNum },
    //                 { landLine },
    //             ]
    //     }
    // )
    // if (isCompanyExist) {
    //     // console.log("errrr");
    //     return next(new Error('Comapny is already exist', { cause: 400 }))
    // }
    // const customId = `${fileName}_${moment().format('DD/MM/YYYY/_HH:mm:ss')}`;
    const fileName = getFileNameWithoutExtension(req.file.originalname);
    const customId = `${fileName}_${nanoId()}`;

    if (!req.file) {
        return next(new Error('Please upload logo for company', { cause: 400 }))
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
        { folder: `${process.env.PROJECT_FOLDER}/Company/${customId}` }
    )
    req.imagePath = `${process.env.PROJECT_FOLDER}/Comapny/${customId}`

    const companyObj = {
        companyName,
        email,
        phoneNum,
        landLine,
        mapLink,
        logo: { secure_url, public_id },
        Facebook,
        Instagram,
        Twitter,
        Linkedin,
        SnapChat,
        Tiktok,
        customId,
        metaDesc,
        metaKeyWords,
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
        metaDesc,
        metaKeyWords,
    } = req.body

    const company = await companyModel.findOne()
    if (!company) {
        return next(new Error('no company exist', { cause: 400 }))
    }
    // const customId = `${fileName}_${moment().format('DD/MM/YYYY/_HH:mm:ss')}`;
    let Company_logo
    if (req.file) {
        const fileName = getFileNameWithoutExtension(req.file.originalname);
        const customId = `${fileName}_${nanoId()}`;
        await cloudinary.uploader.destroy(company.logo.public_id)
        await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Company/${company.customId}`)
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
            { folder: `${process.env.PROJECT_FOLDER}/Company/${customId}` }
        )
        Company_logo = { secure_url, public_id }
        company.customId = customId
        req.imagePath = `${process.env.PROJECT_FOLDER}/Company/${customId}`
    }
    else {
        const secure_url = company.logo.secure_url;
        const public_id = company.logo.public_id
        Company_logo = { secure_url, public_id }
        company.customId = company.customId

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
    company.logo = Company_logo


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