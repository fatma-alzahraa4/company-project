import { aboutModel } from "../../../../DB/models/aboutUsModel.js";
import { companyModel } from "../../../../DB/models/CompanyModel.js"
import { teamModel } from "../../../../DB/models/OurTeamModel.js";
import { mainServiceModel } from '../../../../DB/models/mainServiceModel.js';
import { clientModel } from '../../../../DB/models/OurClientModel.js';
import { projectModel } from "../../../../DB/models/projectModel.js";
import { getOrSetCache } from "../../../utils/redis.js";

export const homeData = async (req, res, next) => {
    const homeData = await getOrSetCache(`homeData`, async () => {
        const [company, mainServices, whyUsData, clients, team, projects] = await Promise.all([
            companyModel.findOne(),
            mainServiceModel.find({ active: true }).populate([
                {
                    path: 'services',
                    match: { active: true },
                    populate: [{
                        path: 'subServices',
                        match: { active: true },
                    }]
                }]),
            aboutModel.findOne().select('-_id whyUsTitle whyUsDesc whyUsSubtitle whyUsImage1 whyUsImage2'),
            clientModel.find({ active: true }).populate('teamId'),
            teamModel.find({ active: true }),
            projectModel.find()
                .select('mainImage.alt mainImage.secure_url name categoryId createdAt')
                .populate([
                    {
                        path: 'categoryId',
                        select: 'name'
                    }
                ]) 
                .sort({ date: -1 }) 
                .limit(6),
        ])
        if (!company) {
            return next(new Error('no company data found', { cause: 400 }))
        }
        if (!mainServices) {
            return next(new Error('no main services found', { cause: 400 }))
        }
        if (!whyUsData) {
            return next(new Error('no why us data found', { cause: 400 }))
        }
        if (!clients) {
            return next(new Error('no clients found', { cause: 400 }))
        }
        if (!team) {
            return next(new Error('no team data found', { cause: 400 }))
        }

        const data = {company,mainServices,whyUsData, clients, team, projects}
        return data;
    })
    res.status(200).json({ message: 'Done',...homeData })
}

//redis
export const homeDataByRedis = async (req, res, next) => {
    const homeData = await getOrSetCache(`homeData`, async () => {
        const [company, mainServices, whyUsData, clients, team, projects] = await Promise.all([
            companyModel.findOne(),
            mainServiceModel.find({ active: true }).populate([
                {
                    path: 'services',
                    match: { active: true },
                    populate: [{
                        path: 'subServices',
                        match: { active: true },
                    }]
                }]),
            aboutModel.findOne().select('-_id whyUsTitle whyUsDesc whyUsSubtitle whyUsImage1 whyUsImage2'),
            clientModel.find({ active: true }).populate('teamId'),
            teamModel.find({ active: true }),
            projectModel.find()
                .select('mainImage.alt mainImage.secure_url name categoryId createdAt')
                .populate([
                    {
                        path: 'categoryId',
                        select: 'name'
                    }
                ]) 
                .sort({ date: -1 }) 
                .limit(6),
        ])
        if (!company) {
            return next(new Error('no company data found', { cause: 400 }))
        }
        if (!mainServices) {
            return next(new Error('no main services found', { cause: 400 }))
        }
        if (!whyUsData) {
            return next(new Error('no why us data found', { cause: 400 }))
        }
        if (!clients) {
            return next(new Error('no clients found', { cause: 400 }))
        }
        if (!team) {
            return next(new Error('no team data found', { cause: 400 }))
        }
        const data = {company,mainServices,whyUsData, clients, team, projects}
        return data;
    });
    res.status(200).json({ message: 'Done',...homeData })
}

