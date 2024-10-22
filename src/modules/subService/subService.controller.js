import { subServiceModel } from "../../../DB/models/subServiceModel.js";
import { clientRedis, getOrSetCache } from "../../utils/redis.js";

export const addSubServiceData = async (req, res, next) => {
    const { name, brief, serviceId } = req.body
    const requiredInputs = [
        'name',
    ];
    requiredInputs.forEach(input => {
        if (!req.body[`${input}`]) {
            return next(new Error(`Missing required field: ${input}`, { cause: 400 }));
        }
    });

    const subServiceObj = {
        name,
        brief,
        serviceId
    }
    const newSubService = await subServiceModel.create(subServiceObj)
    if (!newSubService) {
        return next(new Error('Failed to create sub-service. Please try again.', { cause: 400 }));
    }
    clientRedis.del('homeData');
    clientRedis.del('projectsWebsite');
    clientRedis.del('projectsDashBoard');
    clientRedis.del('mainServicesDashBoard:active');
    clientRedis.del('mainServicesDashBoard:all');
    clientRedis.del('servicesDashBoard:all');
    clientRedis.del('servicesDashBoard:active');
    clientRedis.del('subServicesDashBoard:all');
    clientRedis.del('subServicesDashBoard:active');
    res.status(200).json({ message: 'Done', newSubService })

}

export const editSubService = async (req, res, next) => {
    const { subserviceId } = req.params
    const { name, brief, serviceId } = req.body
    const subService = await subServiceModel.findById(subserviceId)
    if (!subService) {
        return next(new Error('Sub-service not found. Please verify the ID and try again.', { cause: 404 }));
    }
    subService.name = name || subService.name
    subService.brief = brief || subService.brief
    subService.serviceId = serviceId || subService.serviceId

    const updatedSubService = await subService.save()
    if (!updatedSubService) {
        return next(new Error('Failed to update the sub-service. Please try again later.', { cause: 400 }));
    }
    clientRedis.del('homeData');
    clientRedis.del('projectsWebsite');
    clientRedis.del('projectsDashBoard');
    clientRedis.del('mainServicesDashBoard:active');
    clientRedis.del('mainServicesDashBoard:all');
    clientRedis.del('servicesDashBoard:all');
    clientRedis.del('servicesDashBoard:active');
    clientRedis.del('subServicesDashBoard:all');
    clientRedis.del('subServicesDashBoard:active');
    res.status(200).json({ message: 'Done', updatedSubService })
}

export const deleteSubService = async (req, res, next) => {
    const { subserviceId } = req.params
    const deletedSubService = await subServiceModel.findOneAndUpdate({ _id: subserviceId, active: true }, { active: false }, { new: true })
    if (!deletedSubService) {
        return next(new Error('Failed to delete sub-service.Sub-service may not exist or is already inactive.', { cause: 400 }))
    }
    clientRedis.del('homeData');
    clientRedis.del('projectsWebsite');
    clientRedis.del('projectsDashBoard');
    clientRedis.del('mainServicesDashBoard:active');
    clientRedis.del('mainServicesDashBoard:all');
    clientRedis.del('servicesDashBoard:all');
    clientRedis.del('servicesDashBoard:active');
    clientRedis.del('subServicesDashBoard:all');
    clientRedis.del('subServicesDashBoard:active');
    return res.status(200).json({ message: 'Done', deletedSubService })

}

export const getSubServices = async (req, res, next) => {
    const { notActive } = req.query
    if (!notActive || notActive === 'false') {
        const subServices = await getOrSetCache ('subServicesDashBoard:active' , async()=>{
            const subServices = await subServiceModel.find({ active: true })
            const data = {subServices}
            return data
        })
        return res.status(200).json({ message: 'Done', ...subServices })
    }
    else {
        if (notActive == 'true') {
            const subServices = await getOrSetCache ('subServicesDashBoard:all', async ()=>{
                const subServices = await subServiceModel.find()
                const data = {subServices}
                return subServices
            })
            return res.status(200).json({ message: 'Done', ...subServices })
        }
        else {
            return next(new Error('wrong query', { cause: 400 }))
        }
    }

}