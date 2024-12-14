import { companyModel } from "../../../DB/models/CompanyModel.js"
import { contactModel } from "../../../DB/models/ContactUsModel.js"
import { serviceModel } from "../../../DB/models/serviceModel.js"
import { sendEmailService } from "../../services/sendEmail.js"
import { clientRedis, getOrSetCache } from "../../utils/redis.js";
import { emailTemplateCompany, emailTemplatePerson } from './../../utils/emailTemplate.js';

export const contact = async (req, res, next) => {
    const {
        companyName,
        CompanyEmail,
        phoneNum,
        note,
        IP,
        service
    } = req.body
    const isServiceExist = await serviceModel.findOne({ name: service })
    if (!isServiceExist) {
        return next(new Error('No sub-service found with the provided name.', { cause: 404 }));
    }
    const contactObj =
    {
        companyName,
        CompanyEmail,
        phoneNum,
        note,
        IP,
        service
    }
    const contactInfo = await contactModel.create(contactObj)
    if (!contactInfo) {
        return next(new Error('Failed to create contact information.', { cause: 400 }));
    }
    const [isEmailToPersonSent, isEmailToCompanySent] = await Promise.all([
        sendEmailService(
            {
                to: CompanyEmail,
                subject: `Welcome ${companyName}`,
                message: emailTemplatePerson({
                    name: companyName,
                }),
            }),

        sendEmailService(
            {
                to: process.env.NODE_MAILER_USER,
                subject: `new Company Contacts US`,
                message: emailTemplateCompany({
                    companyName: companyName,
                    companyEmail: CompanyEmail,
                    phoneNum: phoneNum,
                    note: note,
                    IPaddress: IP,
                    service: service,
                    link: 'https://www.mailslurp.com/blog/nodemailer-npm/',
                    linkData: 'Click here to go to dashboard',
                    subject: 'notification email new company contacts US',
                }),
            }),
    ])
    if (!isEmailToPersonSent) {
        return next(new Error('Failed to send welcome email to the company representative.', { cause: 400 }));
    }
    if (!isEmailToCompanySent) {
        return next(new Error('Failed to send notification email to the company.', { cause: 400 }));
    }
    clientRedis.del('contactUsersDashBoard');
    res.status(200).json({ message: 'Done', contactInfo })
}

export const getContactUsers = async (req, res, next) => {
    const contactUsers = await getOrSetCache('contactUsersDashBoard', async () => {
        const contactUsers = await contactModel.find()
        const data = { contactUsers }
        return data
    })
    res.status(200).json({ message: 'Done', ...contactUsers })

}
