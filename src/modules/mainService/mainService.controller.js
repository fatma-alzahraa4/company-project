import { serviceModel } from "../../../DB/models/serviceModel.js"
import { customAlphabet } from 'nanoid';
import cloudinary from "../../utils/cloudinaryConfigrations.js";
import { mainServiceModel } from "../../../DB/models/mainServiceModel.js";
import { clientRedis, getOrSetCache } from "../../utils/redis.js";
const nanoId = customAlphabet('abcdefghijklmnopqrstuvwxyz123456890', 5)
const getFileNameWithoutExtension = (filename) => {
    return filename.split('.').slice(0, -1).join('.');
};

export const addMainServiceData = async (req, res, next) => {
    const { name, alt } = req.body
    const requiredInputs = [
        'name',
        'alt',
    ];
    requiredInputs.forEach(input => {
        if (!req.body[`${input}`]) {
            return next(new Error(`Missing required field: ${input}`, { cause: 400 }));
        }
    });
    const fileName = getFileNameWithoutExtension(req.file.originalname);
    const customId = `${fileName}_${nanoId()}`;
    if (!req.file) {
        return next(new Error('Please upload icon for main service', { cause: 400 }))
    }
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
        { folder: `${process.env.PROJECT_FOLDER}/mainService/${customId}` }
    )
    const mainServiceObj = {
        name,
        icon: { secure_url, public_id, alt },
        customId
    }
    const newMainService = await mainServiceModel.create(mainServiceObj)
    if (!newMainService) {
        await cloudinary.uploader.destroy(public_id)
        await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/team/${customId}`)
        return next(new Error('Failed to create main service. Please try again.', { cause: 400 }));
    }

    clientRedis.del('homeData');
    clientRedis.del('mainServicesDashBoard:active');
    clientRedis.del('mainServicesDashBoard:all');
    res.status(200).json({ message: 'Done', newMainService })

}

export const editMainService = async (req, res, next) => {
    const { mainServiceId } = req.params
    const { name, alt } = req.body
    const mainService = await mainServiceModel.findById(mainServiceId)
    if (!mainService) {
        return next(new Error('Main service not found. Please verify the ID and try again.', { cause: 404 }));
    }

    let mainService_icon;
    let uploadedPublicIds = [];
    let uploadedFolders = [];
    if (req.file) {
        const fileName = getFileNameWithoutExtension(req.file.originalname);
        const customId = `${fileName}_${nanoId()}`;
        await cloudinary.uploader.destroy(mainService.icon.public_id)
        const [deletedFolder, { secure_url, public_id }] = await Promise.all([
            cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/mainService/${mainService.customId}`),
            cloudinary.uploader.upload(req.file.path,
                { folder: `${process.env.PROJECT_FOLDER}/mainService/${customId}` }
            )
        ]);
        uploadedPublicIds.push(public_id);
        uploadedFolders.push(`${process.env.PROJECT_FOLDER}/mainService/${customId}`);
        mainService_icon = { secure_url, public_id }
        mainService.customId = customId
    }
    else {
        const secure_url = mainService.icon.secure_url;
        const public_id = mainService.icon.public_id
        mainService_icon = { secure_url, public_id }
        mainService.customId = mainService.customId
    }

    mainService.name = name || mainService.name
    mainService_icon.alt = alt || mainService.icon.alt
    mainService.icon = mainService_icon

    const updatedMainService = await mainService.save()
    if (!updatedMainService) {
        if (uploadedPublicIds.length > 0) {
            await cloudinary.api.delete_resources(uploadedPublicIds);
        }
        if (uploadedFolders.length > 0) {
            await Promise.all(uploadedFolders.map(folder => cloudinary.api.delete_folder(folder)));
        }
        return next(new Error('Failed to update the main service. Please try again later.', { cause: 400 }));

    }
    clientRedis.del('homeData');
    clientRedis.del('mainServicesDashBoard:active');
    clientRedis.del('mainServicesDashBoard:all');
    res.status(200).json({ message: 'Done', updatedMainService })
}

export const deleteMainService = async (req, res, next) => {
    const { mainServiceId } = req.params
    const deletedMainService = await mainServiceModel.findOneAndUpdate({ _id: mainServiceId, active: true }, { active: false }, { new: true })
    if (!deletedMainService) {
        return next(new Error('Failed to delete main service. main service may not exist or is already inactive.', { cause: 404 }))
    }
    // await cloudinary.uploader.destroy(deletedMainService.icon.public_id)
    // await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/mainService/${deletedMainService.customId}`)
    
    clientRedis.del('homeData');
    clientRedis.del('mainServicesDashBoard:active');
    clientRedis.del('mainServicesDashBoard:all');
    
    return res.status(200).json({ message: 'Done', deletedMainService })

}

export const getMainServices = async (req, res, next) => {
    const { notActive } = req.query

    if (!notActive || notActive === 'false') {
        const mainServices = await getOrSetCache('mainServicesDashBoard:active', async () => {
            const mainServices = await mainServiceModel.find({ active: true }).populate([
                {
                    path: 'services',
                    populate: [{
                        path: 'subServices',
                    }]
                }]);
            const data = { mainServices }
            return data
        });

        return res.status(200).json({ message: 'Done', ...mainServices })
    }

    else {
        if (notActive == 'true') {
            const mainServices = await getOrSetCache('mainServicesDashBoard:all', async () => {
                const mainServices = await mainServiceModel.find().populate([
                    {
                        path: 'services',
                        populate: [{
                            path: 'subServices',
                        }]
                    }]);
                const data = { mainServices };
                return data
            });

            return res.status(200).json({ message: 'Done', ...mainServices })
        }

        else {
            return next(new Error('wrong query', { cause: 400 }))
        }
    }
}