import { serviceModel } from "../../../DB/models/serviceModel.js"
import { customAlphabet } from 'nanoid';
import cloudinary from "../../utils/cloudinaryConfigrations.js";
import { teamModel } from '../../../DB/models/OurTeamModel.js';
import { clientModel } from "../../../DB/models/clientModel.js";
import { clientRedis, getOrSetCache } from "../../utils/redis.js";
const nanoId = customAlphabet('abcdefghijklmnopqrstuvwxyz123456890', 5)

const getFileNameWithoutExtension = (filename) => {
    return filename.split('.').slice(0, -1).join('.');
};

export const addClient = async (req, res, next) => {
    const { companyName, details, teamId, altImage, companyLink, isExpertise } = req.body
    if (teamId?.length) {
        for (const Id of teamId) {
            const isTeamExist = await teamModel.findById(Id)
            if (!isTeamExist) {
                return next(new Error('no team Id found', { cause: 400 }))
            }
        }
    }
    const requiredInputs = [
        'companyName',
        'altImage',
    ];
    requiredInputs.forEach(input => {
        if (!req.body[`${input}`]) {
            return next(new Error(`Missing required field: ${input}`, { cause: 400 }));
        }
    });
    if (!req.file) {
        return next(new Error('Please upload client logo', { cause: 400 }))
    }
    const fileName = getFileNameWithoutExtension(req.file.originalname);
    const customId = `${fileName}_${nanoId()}`;

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
        { folder: `${process.env.PROJECT_FOLDER}/clients/${customId}` }
    )
    const clientObj = {
        companyName,
        details,
        logo: { secure_url, public_id, alt: altImage, customId },
        teamId,
        companyLink,
        isExpertise
    }
    const newClient = await clientModel.create(clientObj)
    if (!newClient) {
        await cloudinary.uploader.destroy(public_id)
        await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/clients/${customId}`);

        return next(new Error('Failed to create client. Please try again.', { cause: 400 }));
    }
    clientRedis.del('homeData');
    clientRedis.del('clientsDashBoard:active');
    clientRedis.del('clientsDashBoard:all');
    clientRedis.del('projectsDashBoard');
    clientRedis.del('projectsWebsite');

    res.status(200).json({ message: 'Done', newClient })

}

export const editClientData = async (req, res, next) => {
    const { clientId } = req.params
    const { companyName, details, teamId, altImage, companyLink, isExpertise } = req.body
    if (teamId?.length) {
        for (const Id of teamId) {
            const isTeamExist = await teamModel.findById(Id)
            if (!isTeamExist) {
                return next(new Error('no team Id found', { cause: 400 }))
            }
        }
    }
    const client = await clientModel.findById(clientId).populate('teamId')
    if (!client) {
        return next(new Error('Client not found. Please verify the ID and try again.', { cause: 404 }));
    }
    let client_logo;
    let uploadedPublicIds = [];
    let uploadedFolders = [];
    if (req.file) {
        const fileName = getFileNameWithoutExtension(req.file.originalname);
        const customId = `${fileName}_${nanoId()}`;
        await cloudinary.uploader.destroy(client.logo.public_id)
        const [deletedFolder, { secure_url, public_id }] = await Promise.all([
            cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/clients/${client.logo.customId}`),
            cloudinary.uploader.upload(req.file.path,
                { folder: `${process.env.PROJECT_FOLDER}/clients/${customId}` }
            )
        ]);
        uploadedPublicIds.push(public_id);
        uploadedFolders.push(`${process.env.PROJECT_FOLDER}/clients/${customId}`);
        client_logo = { secure_url, public_id, customId }
    }
    else {
        const secure_url = client.logo.secure_url;
        const public_id = client.logo.public_id;
        const customId = client.logo.customId;
        client_logo = { secure_url, public_id, customId }
    }

    client.companyName = companyName || client.companyName;
    client.details = details || client.details;
    client.companyLink = companyLink || client.companyLink;
    client.isExpertise = isExpertise || client.isExpertise;
    client.teamId = teamId || client.teamId;
    client_logo.alt = altImage || client.logo.alt;
    client.logo = client_logo;

    const updatedClient = await client.save()
    if (!updatedClient) {
        if (uploadedPublicIds.length > 0) {
            await cloudinary.api.delete_resources(uploadedPublicIds);
        }
        if (uploadedFolders.length > 0) {
            await Promise.all(uploadedFolders.map(folder => cloudinary.api.delete_folder(folder)));
        }
        return next(new Error('Failed to update client. Please try again later.', { cause: 400 }));
    }
    clientRedis.del('homeData');
    clientRedis.del('clientsDashBoard:active');
    clientRedis.del('clientsDashBoard:all');
    clientRedis.del('projectsDashBoard');
    clientRedis.del('projectsWebsite');
    res.status(200).json({ message: 'Done', updatedClient })
}

export const deleteClient = async (req, res, next) => {
    const { clientId } = req.params
    const deletedClient = await clientModel.findOneAndUpdate({ _id: clientId, active: true }, { active: false }, { new: true })
    if (!deletedClient) {
        return next(new Error('Failed to delete client. client may not exist or is already inactive.', { cause: 404 }))
    }
    clientRedis.del('homeData');
    clientRedis.del('clientsDashBoard:active');
    clientRedis.del('clientsDashBoard:all');
    clientRedis.del('projectsDashBoard');
    clientRedis.del('projectsWebsite');
    return res.status(200).json({ message: 'Done', deletedClient })
}

export const getClients = async (req, res, next) => {
    const { notActive } = req.query
    if (!notActive) {
        const clients = await getOrSetCache('clientsDashBoard:active', async () => {
            const clients = await clientModel.find({ active: true }).populate('teamId')
            const data = { clients }
            return data
        })
        return res.status(200).json({ message: 'Done', ...clients })
    }
    else {
        if (notActive == 'true') {
            const clients = await getOrSetCache('clientsDashBoard:all', async () => {
                const clients = await clientModel.find().populate('teamId');
                const data = { clients }
                return data
            })
            return res.status(200).json({ message: 'Done', ...clients })
        }
        else {
            return next(new Error('wrong query', { cause: 400 }))
        }
    }

}
