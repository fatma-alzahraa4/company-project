import { serviceModel } from "../../../DB/models/serviceModel.js"
import { customAlphabet } from 'nanoid';
import cloudinary from "../../utils/cloudinaryConfigrations.js";
import { clientRedis, getOrSetCache } from "../../utils/redis.js";
const nanoId = customAlphabet('abcdefghijklmnopqrstuvwxyz123456890', 5)
const getFileNameWithoutExtension = (filename) => {
    return filename.split('.').slice(0, -1).join('.');
};

export const addService = async (req, res, next) => {
    const { name, brief, isHome, altIcon } = req.body
    const requiredInputs = [
        'name',
        'altIcon'
    ];
    requiredInputs.forEach(input => {
        if (!req.body[`${input}`]) {
            return next(new Error(`Missing required field: ${input}`, { cause: 400 }));
        }
    });
    if (!req.file) {
        return next(new Error('Please upload icon for service', { cause: 400 }))
    }
    const fileName = getFileNameWithoutExtension(req.file.originalname);
    const customId = `${fileName}_${nanoId()}`;
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
        { folder: `${process.env.PROJECT_FOLDER}/Service/${customId}` }
    )
    const serviceObj = {
        name,
        brief,
        isHome: isHome || false,
        icon: { secure_url, public_id, alt: altIcon, customId },
    }
    const newService = await serviceModel.create(serviceObj)
    if (!newService) {
        await cloudinary.uploader.destroy(public_id)
        await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Service/${customId}`)
        return next(new Error('Failed to create service. Please try again.', { cause: 400 }));
    }

    clientRedis.del('homeData');
    clientRedis.del('projectsWebsite');
    clientRedis.del('projectsDashBoard');
    clientRedis.del('servicesDashBoard:active');
    clientRedis.del('servicesDashBoard:all');
    res.status(200).json({ message: 'Done', service: newService })

}

export const editService = async (req, res, next) => {
    const { serviceId } = req.params
    const { name, brief, isHome, altIcon } = req.body
    const service = await serviceModel.findById(serviceId)
    if (!service) {
        return next(new Error('Service not found. Please verify the ID and try again.', { cause: 404 }));
    }

    let service_icon;
    let uploadedPublicIds = [];
    let uploadedFolders = [];
    if (req.file) {
        const fileName = getFileNameWithoutExtension(req.file.originalname);
        const customId = `${fileName}_${nanoId()}`;
        if(service.icon.public_id){
            await cloudinary.uploader.destroy(service.icon.public_id)
            await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Service/${service.icon.customId}`)
        }
        const{ secure_url, public_id } = await cloudinary.uploader.upload(req.file.path,
            { folder: `${process.env.PROJECT_FOLDER}/Service/${customId}` }
        )
            
        uploadedPublicIds.push(public_id);
        uploadedFolders.push(`${process.env.PROJECT_FOLDER}/Service/${customId}`);
        service_icon = {
            secure_url,
            public_id,
            customId,
            alt: altIcon || service.icon.alt,
        };
    }
    else {
        service_icon = {
            ...service.icon,
            alt: altIcon || service.icon.alt,
        };
    }

    service.name = name || service.name;
    service.brief = brief || service.brief;
    service.isHome = isHome || service.isHome;
    service.icon = service_icon

    const updatedService = await service.save()
    if (!updatedService) {
        if (uploadedPublicIds.length > 0) {
            await cloudinary.api.delete_resources(uploadedPublicIds);
        }
        if (uploadedFolders.length > 0) {
            await Promise.all(uploadedFolders.map(folder => cloudinary.api.delete_folder(folder)));
        }
        return next(new Error('Failed to update the main service. Please try again later.', { cause: 400 }));

    }
    clientRedis.del('homeData');
    clientRedis.del('projectsWebsite');
    clientRedis.del('projectsDashBoard');
    clientRedis.del('servicesDashBoard:active');
    clientRedis.del('servicesDashBoard:all');
    res.status(200).json({ message: 'Done', service: updatedService })
}

export const deleteService = async (req, res, next) => {
    const { serviceId } = req.params
    const deletedService = await serviceModel.findOneAndUpdate({ _id: serviceId, active: true }, { active: false }, { new: true })
    if (!deletedService) {
        return next(new Error('Failed to delete service. service may not exist or is already inactive.', { cause: 404 }))
    }
    // await cloudinary.uploader.destroy(deletedService.icon.public_id)
    // await cloudinary.api.delete_folder(`${process.env.PROJECT_FOLDER}/Service/${deletedService.icon.customId}`)

    clientRedis.del('homeData');
    clientRedis.del('projectsWebsite');
    clientRedis.del('projectsDashBoard');
    clientRedis.del('servicesDashBoard:active');
    clientRedis.del('servicesDashBoard:all');

    return res.status(200).json({ message: 'Done' })

}

export const getServices = async (req, res, next) => {
    const { notActive } = req.query

    if (!notActive || notActive === 'false') {
        const services = await getOrSetCache('servicesDashBoard:active', async () => {
            const services = await serviceModel.find({ active: true })
            const data = { services }
            return data
        });

        return res.status(200).json({ message: 'Done', ...services })
    }

    else {
        if (notActive == 'true') {
            const services = await getOrSetCache('servicesDashBoard:all', async () => {
                const services = await serviceModel.find()
                const data = { services };
                return data
            });

            return res.status(200).json({ message: 'Done', ...services })
        }

        else {
            return next(new Error('wrong query', { cause: 400 }))
        }
    }
}
