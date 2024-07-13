import { companyModel } from "../../../DB/models/CompanyModel.js"
import { contactModel } from "../../../DB/models/ContactUsModel.js"
import { subServiceModel } from "../../../DB/models/subServiceModel.js"
import { sendEmailService } from "../../services/sendEmail.js"
import { emailTemplateCompany, emailTemplatePerson } from './../../utils/emailTemplate.js';

export const contact = async (req, res, next) => {
    const { 
        companyName, 
        CompanyEmail, 
        phoneNum, 
        note, 
        IP, 
        subService 
    } = req.body
    const isSubServiceExist = await subServiceModel.findOne({name:subService})
    if(!isSubServiceExist){
        return next(new Error('no subService Found', { cause: 400 }))
    }
    const contactObj = 
    {  
        companyName, 
        CompanyEmail, 
        phoneNum, 
        note, 
        IP, 
        subService 
    }
    const contactInfo = await contactModel.create(contactObj)
    if(!contactInfo){
        return next(new Error('creation failed', { cause: 400 }))
    }
    const isEmailToPersonSent = sendEmailService(
        {to: CompanyEmail,
        subject:`Welcome ${companyName}`,
        message: emailTemplatePerson({
            subject: 'Thank you for reaching out to us. We appreciate your message and will get back to you shortly.',
          }),
    })
    if(!isEmailToPersonSent){
        return next(new Error('fail to send email',{cause:400}))
    }
    const isEmailToCompanySent = sendEmailService(
        {to: 'Kfatmaalzahraa@gmail.com',
        subject:`new Company Contacts US`,
        message: emailTemplateCompany({
            companyName:companyName, 
            companyEmail:CompanyEmail, 
            phoneNum:phoneNum, 
            note:note, 
            IPaddress:IP, 
            subService:subService,
            link: 'https://www.mailslurp.com/blog/nodemailer-npm/',
            linkData: 'Click here to go to dashboard',
            subject: 'notification email new company contacts US',
          }),
    })
    if(!isEmailToCompanySent){
        return next(new Error('fail to send email',{cause:400}))
    }
    res.status(200).json({ message: 'Done', contactInfo })
}

export const getContactUsers = async (req,res,next)=>{
    const Contactusers = await contactModel.find()
    if(!Contactusers){
        return next(new Error('fail to get users',{cause:400}))
    }
    res.status(200).json({ message: 'Done', Contactusers })

}
