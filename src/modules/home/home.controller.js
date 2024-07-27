import { aboutModel } from "../../../DB/models/aboutUsModel.js";
import { companyModel } from "../../../DB/models/CompanyModel.js"
import { teamModel } from "../../../DB/models/OurTeamModel.js";
import { mainServiceModel } from '../../../DB/models/mainServiceModel.js';
import { clientModel } from '../../../DB/models/OurClientModel.js';

export const homeData = async (req, res, next) => {
    const company = await companyModel.findOne()
    if (!company) {
        return next(new Error('no company data found', { cause: 400 }))
    }

    const mainServices = await mainServiceModel.find({ active: true }).populate([
        {
            path: 'services',
            match: { active: true },
            populate: [{
                path: 'subServices',
                match: { active: true },
            }]
        }])
    if (!mainServices) {
        return next(new Error('no main services found', { cause: 400 }))
    }

    const whyUsData = await aboutModel.findOne().select('-_id whyUsTitle whyUsDesc whyUsSubtitle whyUsImage1 whyUsImage2')
    if (!whyUsData) {
        return next(new Error('no why us data found', { cause: 400 }))
    }

    const clients  = await clientModel.find({ active: true }).populate('teamId')
    if(!clients){
        return next(new Error('no clients found', { cause: 400 }))
    }

    const team = await teamModel.find({ active: true })
    if(!team){
        return next(new Error('no team data found', { cause: 400 }))
    }
    res.status(200).json({ message: 'Done', company,mainServices,whyUsData,clients,team })

}