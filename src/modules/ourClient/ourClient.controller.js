import { serviceModel } from "../../../DB/models/serviceModel.js"
import { customAlphabet } from 'nanoid';
import cloudinary from "../../utils/cloudinaryConfigrations.js";
import { subServiceModel } from "../../../DB/models/subServiceModel.js";
import { clientModel } from "../../../DB/models/OurClientModel.js";
import { teamModel } from './../../../DB/models/OurTeamModel.js';
const nanoId = customAlphabet('abcdefghijklmnopqrstuvwxyz123456890', 5)

const getFileNameWithoutExtension = (filename) => {
    return filename.split('.').slice(0, -1).join('.');
  };
export const addOurClient = async (req, res, next) => {
    const { companyName, details, teamId, altImage, altVideo } = req.body
    if (teamId.length) {
        for (const Id of teamId) {
            const isTeamExist = await teamModel.findById(Id)
            if (!isTeamExist) {
                return next(new Error('no team Id found', { cause: 400 }))
            }
        }
    }
    if (!companyName) {
        return next(new Error('Please enter a Company Name', { cause: 400 }))
    }
    const logo = req.files['logo'][0];
    const video = req.files['video'][0];
    const logoName = getFileNameWithoutExtension(logo.originalname);
    const videoName = getFileNameWithoutExtension(video.originalname);
    const customIdImage = `${logoName}_${nanoId()}`
    const customIdVideo = `${videoName}_${nanoId()}`

    if (!req.files['logo']) {
        return next(new Error('Please upload logo for our clients', { cause: 400 }))
    }

    const { secure_url: imageSecureUrl, public_id: imagePublicId } = await cloudinary.uploader.upload(req.files['logo'][0].path,
        { folder: `${process.env.PROJECT_FOLDER}/clientsImage/${customIdImage}` }
    )
    req.imagePath = `${process.env.PROJECT_FOLDER}/clientsImage/${customIdImage}`
    const { secure_url: videoSecureUrl, public_id: videoPublicId } = await cloudinary.uploader.upload(req.files['video'][0].path, {
        resource_type: 'video',
        folder: `${process.env.PROJECT_FOLDER}/clientsVideo/${customIdVideo}`
    });

    req.videoPath = `${process.env.PROJECT_FOLDER}/clientsVideo/${customIdVideo}`;


    const clientObj = {
        companyName,
        details,
        logo: { secure_url: imageSecureUrl, public_id: imagePublicId, alt: altImage },
        teamId,
        video: { secure_url: videoSecureUrl, public_id: videoPublicId, alt: altVideo },
        customIdImage,
        customIdVideo

    }
    const newClient = await clientModel.create(clientObj)
    if (!newClient) {
        await cloudinary.api.delete_resources([imagePublicId, videoPublicId]);
        await Promise.all([
            cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/clientsImage/${customIdImage}`),
            cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/clientsVideo/${customIdVideo}`)
        ]);
        return next(new Error('creation failed', { cause: 400 }))
    }
    res.status(200).json({ message: 'Done', newClient })

}

export const editClientData = async (req, res, next) => {
    const { clientId } = req.params
    const { companyName, details, teamId, altImage, altVideo } = req.body
    if (teamId.length) {
        for (const Id of teamId) {
            const isTeamExist = await teamModel.findById(Id)
            if (!isTeamExist) {
                return next(new Error('no team Id found', { cause: 400 }))
            }
        }
    }
    const client = await clientModel.findById(clientId)
    if (!client) {
        return next(new Error('no client exist', { cause: 400 }))
    }
    
    let client_logo
    let client_video
   
    if (req.files['logo']) {
        const logo = req.files['logo'][0];
        const logoName = getFileNameWithoutExtension(logo.originalname);
        const customIdImage = `${logoName}_${nanoId()}`
        await cloudinary.uploader.destroy(client.logo.public_id)
        await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/clientsImage/${client.customIdImage}`)
        const { secure_url: imageSecureUrl, public_id: imagePublicId } = await cloudinary.uploader.upload(req.files['logo'][0].path,
            { folder: `${process.env.PROJECT_FOLDER}/clientsImage/${customIdImage}` }
        )
        client_logo = { secure_url: imageSecureUrl, public_id: imagePublicId }
        client.customIdImage = customIdImage
        req.imagePath = `${process.env.PROJECT_FOLDER}/clientsImage/${customIdImage}`
    }
    else {
        client_logo = client.logo
        client.customIdImage = client.customIdImage
    }
    if (req.files['video']) {
        const video = req.files['video'][0];
        const videoName = getFileNameWithoutExtension(video.originalname);
        const customIdVideo = `${videoName}_${nanoId()}`
        await cloudinary.uploader.destroy(client.video.public_id, { resource_type: 'video' });
        await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/clientsVideo/${client.customIdVideo}`)
        const { secure_url: videoSecureUrl, public_id: videoPublicId } = await cloudinary.uploader.upload(req.files['video'][0].path, {
            resource_type: 'video',
            folder: `${process.env.PROJECT_FOLDER}/clientsVideo/${customIdVideo}`
        });
        client_video = { secure_url: videoSecureUrl, public_id: videoPublicId }
        client.customIdVideo = customIdVideo
        req.videoPath = `${process.env.PROJECT_FOLDER}/clientsVideo/${customIdVideo}`;
    }
    else {
        client_video = client.video
        client.customIdVideo = client.customIdVideo
    }


    if (!companyName) {
        client.companyName = client.companyName
    }
    else {
        client.companyName = companyName
    }
    if (!details) {
        client.details = client.details
    }
    else {
        client.details = details
    }
    if (!teamId) {
        client.teamId = client.teamId
    }
    else {
        client.teamId = teamId
    }
    if (!altImage) {
        client.logo = { ...client_logo, alt: client.logo.alt }

    }
    else {
        client.logo = { ...client_logo, alt: altImage }
    }
    if (!altVideo) {
        client.video = { ...client_video, alt: client.video.alt }
    }
    else {
        client.video = { ...client_video, alt: altVideo }
    }


    const updatedClient = await client.save()
    if (!updatedClient) {
        await cloudinary.uploader.destroy(client.logo.public_id);
        await cloudinary.uploader.destroy(client.video.public_id, { resource_type: 'video' });
        await Promise.all([
            cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/clientsImage/${customIdImage}`),
            cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/clientsVideo/${customIdVideo}`)
        ]);
        return next(new Error('update failed', { cause: 400 }))

    }
    res.status(200).json({ message: 'Done', updatedClient })
}

export const deleteClient = async (req, res, next) => {
    const { clientId } = req.params
    const deletedClient = await clientModel.findByIdAndDelete(clientId)
    if (!deletedClient) {
        return next(new Error('failed to delete', { cause: 400 }))
    }
    await cloudinary.uploader.destroy(deletedClient.logo.public_id);
    await cloudinary.uploader.destroy(deletedClient.video.public_id, { resource_type: 'video' });
    await Promise.all([
        cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/clientsImage/${deletedClient.customIdImage}`),
        cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/clientsVideo/${deletedClient.customIdVideo}`)
    ]);
    return res.status(200).json({ message: 'Done', deletedClient })

}
export const getClients = async (req, res, next) => {
    const client = await clientModel.find().populate('teamId')
    if (!client) {
        return next(new Error('failed to get client data', { cause: 400 }))
    }
    return res.status(200).json({ message: 'Done', client })
}
