import { teamModel } from "../../../DB/models/OurTeamModel.js";
import { customAlphabet } from 'nanoid';
import cloudinary from "../../utils/cloudinaryConfigrations.js";
const nanoId = customAlphabet('abcdefghijklmnopqrstuvwxyz123456890', 5)
const getFileNameWithoutExtension = (filename) => {
    return filename.split('.').slice(0, -1).join('.');
};

export const addTeamMember = async (req, res, next) => {
    const {
        name,
        position,
        qoute,
        alt
    } = req.body
    if (!name || !position) {
        return next(new Error('please enter all required data', { cause: 400 }))
    }
    const fileName = getFileNameWithoutExtension(req.file.originalname);
    const customId = `${fileName}_${nanoId()}`;
    if (!req.file) {
        return next(new Error('Please upload image for team member', { cause: 400 }))
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
        { folder: `${process.env.PROJECT_FOLDER}/team/${customId}` }
    )
    req.imagePath = `${process.env.PROJECT_FOLDER}/team/${customId}`

    const teamObj = {
        name,
        position,
        qoute,
        image: { secure_url, public_id, alt },
        customId
    }
    const newTeamMember = await teamModel.create(teamObj)
    if (!newTeamMember) {
        await cloudinary.uploader.destroy(public_id)
        await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/team/${customId}`)
        return next(new Error('creation failed', { cause: 400 }))
    }
    res.status(200).json({ message: 'Done', newTeamMember })
}

export const editTeamMember = async (req, res, next) => {
    const { memberId } = req.params
    const {
        name,
        position,
        qoute,
        alt
    } = req.body

    const team = await teamModel.findById(memberId)
    if (!team) {
        return next(new Error('no team exist', { cause: 400 }))
    }

    let team_image
    if (req.file) {
        const fileName = getFileNameWithoutExtension(req.file.originalname);
        const customId = `${fileName}_${nanoId()}`;
        await cloudinary.uploader.destroy(team.image.public_id)
        await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/team/${team.customId}`)
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
            { folder: `${process.env.PROJECT_FOLDER}/team/${customId}` }
        )
        req.imagePath = `${process.env.PROJECT_FOLDER}/team/${customId}`
        team_image = { secure_url, public_id }
        team.customId = customId
    }
    else {
        const secure_url = team.image.secure_url;
        const public_id = team.image.public_id
        team_image = { secure_url, public_id }
        team.customId = team.customId

    }
    if (!name) {
        team.name = team.name
    }
    else {
        team.name = name
    }
    if (!position) {
        team.position = team.position
    }
    else {
        team.position = position
    }
    if (!qoute) {
        team.qoute = team.qoute
    }
    else {
        team.qoute = qoute
    }
    if (!alt) {
        team.image = { ...team_image, alt: team.image.alt }
    }
    else {
        team.image = { ...team_image, alt }
    }


    const updatedTeam = await team.save()
    if (!updatedTeam) {
        await cloudinary.uploader.destroy(public_id)
        await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/team/${customId}`)
        return next(new Error('update failed', { cause: 400 }))

    }
    res.status(200).json({ message: 'Done', updatedTeam })
}

export const deleteTeamMember = async (req, res, next) => {
    const { memberId } = req.params
    const deletedmember = await teamModel.findOneAndUpdate({_id:memberId,active:true}, { active: false },{new:true})
    if (!deletedmember) {
        return next(new Error('failed to delete', { cause: 400 }))
    }
    // await cloudinary.uploader.destroy(deletedmember.image.public_id)
    // await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/team/${deletedmember.customId}`)
    return res.status(200).json({ message: 'Done', deletedmember })

}

export const getTeam = async (req, res, next) => {
    const { notActive } = req.query
    if (!notActive) {
        const teamMembers = await teamModel.find({ active: true })
        if (!teamMembers) {
            return next(new Error('failed to get team members', { cause: 400 }))
        }
        return res.status(200).json({ message: 'Done', teamMembers })
    }
    else {
        if (notActive == 'true') {
            const teamMembers = await teamModel.find()
            if (!teamMembers) {
                return next(new Error('failed to get team members', { cause: 400 }))
            }
            return res.status(200).json({ message: 'Done', teamMembers })
        }
        else {
            return next(new Error('wrong query', { cause: 400 }))
        }
    }

}