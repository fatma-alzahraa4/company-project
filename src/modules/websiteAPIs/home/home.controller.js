import { aboutModel } from "../../../../DB/models/aboutUsModel.js";
import { companyModel } from "../../../../DB/models/CompanyModel.js"
import { teamModel } from "../../../../DB/models/OurTeamModel.js";
import { projectModel } from "../../../../DB/models/projectModel.js";
import { getOrSetCache } from "../../../utils/redis.js";
import { clientModel } from "../../../../DB/models/clientModel.js";
import { serviceModel } from "../../../../DB/models/serviceModel.js";

export const homeData = async (req, res, next) => {
    const homeData = await getOrSetCache(`homeData`, async () => {
        const [company, services, whyUsData, clients, expertise, team, projects] = await Promise.all([
            companyModel.findOne().select('-updatedAt -__v -_id -logo.public_id -logo.customId -contactUsImage.public_id -contactUsImage.customId'),
            serviceModel.find({ active: true })
            .select('-updatedAt -__v -icon.public_id -icon.customId'),
            aboutModel.findOne().select('-_id whyUsTitle whyUsDesc whyUsSubtitle whyUsImage1.secure_url whyUsImage1.alt whyUsImage2.secure_url whyUsImage2.alt '),
            clientModel.find({ active: true, isExpertise:false }).select('-updatedAt -__v -active -logo.public_id -logo.customId')
            .populate([
                {
                    path:'teamId',
                    match: { active: true },
                    select:'-active -updatedAt -__v -image.customId -image.public_id'
                }
            ]),
            clientModel.find({ active: true, isExpertise:true }).select('-updatedAt -__v -active -logo.public_id -logo.customId'),
            teamModel.find({ active: true }).select('-image.public_id -image.customId -__v -updatedAt'),
            projectModel.find()
                .select('mainImage.alt mainImage.secure_url name categoryId createdAt')
                .populate([
                    {
                        path: 'categoryId',
                        select: 'name'
                    },
                    {
                        path: 'clientId',
                        select: 'companyName companyLink logo.secure_url logo.alt active'
                    }
                ]) 
                .sort({ date: -1 }) 
                .limit(6),
        ])
        if (!company) {
            return next(new Error('No company data found in the database. Please ensure that the company data exists.', { cause: 404  }))
        }
        if (!whyUsData) {
            return next(new Error('No whyUs data found in the database. Please ensure that the whyUs data exists.', { cause: 404  }))
        }
        const data = {company,services,whyUsData, clients, expertise, team, projects}
        return data;
    })
    res.status(200).json({ message: 'Done',...homeData })
}


