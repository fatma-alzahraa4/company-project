import { serviceModel } from "../../../DB/models/serviceModel.js"
import { customAlphabet } from 'nanoid';
import cloudinary from "../../utils/cloudinaryConfigrations.js";
import { mainServiceModel } from "../../../DB/models/mainServiceModel.js";
import { clientRedis, getOrSetCache } from './../../utils/redis.js';



export const addServiceData = async (req, res, next) => {
    const { name, mainServiceId } = req.body
    const requiredInputs = [
        'name',
        'mainServiceId',
    ];
    requiredInputs.forEach(input => {
        if (!req.body[`${input}`]) {
            return next(new Error(`Missing required field: ${input}`, { cause: 400 }));
        }
    });
    const isMainServiceExist = await mainServiceModel.findById(mainServiceId)
    if (!isMainServiceExist) {
        return next(new Error('Main service not found. Please verify the ID and try again.', { cause: 404 }));
    }
    const serviceObj = {
        name,
        mainServiceId
    }
    const newService = await serviceModel.create(serviceObj)
    if (!newService) {
        return next(new Error('Failed to create service. Please try again.', { cause: 400 }));
    }
    clientRedis.del('homeData');
    clientRedis.del('mainServicesDashBoard:active');
    clientRedis.del('mainServicesDashBoard:all');
    clientRedis.del('servicesDashBoard:all');
    clientRedis.del('servicesDashBoard:active');

    res.status(200).json({ message: 'Done', newService })

}

export const editService = async (req, res, next) => {
    const { serviceId } = req.params
    const { name, mainServiceId } = req.body
    const service = await serviceModel.findById(serviceId)
    if (!service) {
        return next(new Error('Service not found. Please verify the ID and try again.', { cause: 404 }));
    }

    service.mainServiceId = mainServiceId || service.mainServiceId
    service.name = name || service.name

    const updatedService = await service.save()
    if (!updatedService) {
        return next(new Error('Failed to update the service. Please try again later.', { cause: 400 }));

    }
    clientRedis.del('homeData');
    clientRedis.del('mainServicesDashBoard:active');
    clientRedis.del('mainServicesDashBoard:all');
    clientRedis.del('servicesDashBoard:all');
    clientRedis.del('servicesDashBoard:active');
    res.status(200).json({ message: 'Done', updatedService })
}

export const deleteService = async (req, res, next) => {
    const { serviceId } = req.params
    const deletedService = await serviceModel.findOneAndUpdate({ _id: serviceId, active: true }, { active: false }, { new: true })
    if (!deletedService) {
        return next(new Error('Failed to delete service. Service may not exist or is already inactive.', { cause: 400 }))
    }
    clientRedis.del('homeData');
    clientRedis.del('mainServicesDashBoard:active');
    clientRedis.del('mainServicesDashBoard:all');
    clientRedis.del('servicesDashBoard:all');
    clientRedis.del('servicesDashBoard:active');
    return res.status(200).json({ message: 'Done', deletedService })

}

export const getservices = async (req, res, next) => {
    const { notActive } = req.query
    if (!notActive || notActive === 'false') {
        const services = await getOrSetCache('servicesDashBoard:active', async () => {
            const services = await serviceModel.find({ active: true }).populate([
                {
                    path: 'mainServiceId',
                    select:'name'
                },
                {
                    path: 'subServices',
                }]);
            const data = { services }
            return data
        });
        return res.status(200).json({ message: 'Done', ...services })
    }
    else {
        if (notActive == 'true') {
            const services = await getOrSetCache('servicesDashBoard:all', async () => {
                const services = await serviceModel.find().populate([
                    {
                        path: 'mainServiceId',
                        select:'name'
                    },
                    {
                        path: 'subServices',
                    }]);
                const data = { services }
                return data
            });
            return res.status(200).json({ message: 'Done', ...services })
        }
        else {
            return next(new Error('wrong query', { cause: 400 }))
        }
    }

}