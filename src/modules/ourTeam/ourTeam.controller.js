import { teamModel } from "../../../DB/models/OurTeamModel.js";
import { customAlphabet } from 'nanoid';
import cloudinary from "../../utils/cloudinaryConfigrations.js";
import { clientRedis, getOrSetCache } from "../../utils/redis.js";
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
    const requiredInputs = [
        'name',
        'position',
    ];
    requiredInputs.forEach(input => {
        if (!req.body[`${input}`]) {
            return next(new Error(`Missing required field: ${input}`, { cause: 400 }));
        }
    });
    if (!req.file) {
        return next(new Error('Please upload an image for the team member.', { cause: 400 }));
    }
    const fileName = getFileNameWithoutExtension(req.file.originalname);
    const customId = `${fileName}_${nanoId()}`;
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
        { folder: `${process.env.PROJECT_FOLDER}/team/${customId}` }
    )
    const teamObj = {
        name,
        position,
        qoute,
        image: { secure_url, public_id, alt, customId},
        
    }
    const newTeamMember = await teamModel.create(teamObj)
    if (!newTeamMember) {
        await cloudinary.uploader.destroy(public_id)
        await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/team/${customId}`)
        return next(new Error('Failed to create team member.', { cause: 400 }));
    }
    clientRedis.del('homeData');
    clientRedis.del('teamDashBoard');
    clientRedis.del('clientsDashBoard:active');
    clientRedis.del('clientsDashBoard:all');
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
        return next(new Error('Team member not found. Please verify the ID and try again.', { cause: 404 }));
    }

    let team_image;
    let uploadedPublicIds = [];
    let uploadedFolders = [];
    if (req.file) {
        const fileName = getFileNameWithoutExtension(req.file.originalname);
        const customId = `${fileName}_${nanoId()}`;
        await cloudinary.uploader.destroy(team.image.public_id)
        await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/team/${team.image.customId}`)
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
            { folder: `${process.env.PROJECT_FOLDER}/team/${customId}` }
        )
        uploadedPublicIds.push(public_id);
        uploadedFolders.push(`${process.env.PROJECT_FOLDER}/team/${customId}`);
        team_image = { secure_url, public_id, customId }
    }
    else {
        const secure_url = team.image.secure_url;
        const public_id = team.image.public_id;
        const customId = team.image.customId;
        team_image = { secure_url, public_id, customId }
    }

    team.name = name || team.name
    team.position = position || team.position
    team.qoute = qoute || team.qoute
    team_image.alt = alt || team.image.alt
    team.image = team_image
    const updatedTeam = await team.save()
    if (!updatedTeam) {
        if (uploadedPublicIds.length > 0) {
            await cloudinary.api.delete_resources(uploadedPublicIds);
        }
        if (uploadedFolders.length > 0) {
            await Promise.all(uploadedFolders.map(folder => cloudinary.api.delete_folder(folder)));
        }
        return next(new Error('Failed to update team member.', { cause: 400 }));
    }
    clientRedis.del('homeData');
    clientRedis.del('teamDashBoard');
    clientRedis.del('clientsDashBoard:active');
    clientRedis.del('clientsDashBoard:all');
    res.status(200).json({ message: 'Done', updatedTeam })
}

export const deleteTeamMember = async (req, res, next) => {
    const { memberId } = req.params
    const deletedMember = await teamModel.findOneAndUpdate({ _id: memberId, active: true }, { active: false }, { new: true })
    if (!deletedMember) {
        return next(new Error('Failed to delete team member. Member may not exist or is already inactive.', { cause: 404 }));
    }
    // await cloudinary.uploader.destroy(deletedMember.image.public_id)
    // await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/team/${deletedMember.image.customId}`)
    clientRedis.del('homeData');
    clientRedis.del('teamDashBoard');
    clientRedis.del('clientsDashBoard:active');
    clientRedis.del('clientsDashBoard:all');
    return res.status(200).json({ message: 'Done', deletedMember })

}

export const getTeam = async (req, res, next) => {
    const { notActive } = req.query
    if (!notActive || notActive == 'false') {
        const teamMembers = await getOrSetCache('teamDashBoard', async () =>{
            const teamMembers = await teamModel.find({ active: true });
            const data = {teamMembers};
            return data
        })
        return res.status(200).json({ message: 'Done', ...teamMembers })
    }
    else {
        if (notActive == 'true') {
            const teamMembers = await getOrSetCache('teamDashBoard', async ()=>{
                const teamMembers = await teamModel.find();
                const data = {teamMembers}
                return data
            })
            return res.status(200).json({ message: 'Done', ...teamMembers })
        }
        else {
            return next(new Error('Invalid query parameter for notActive. Expected "true" or "false".', { cause: 400 }));
        }
    }

}