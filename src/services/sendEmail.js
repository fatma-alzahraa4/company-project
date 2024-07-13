import nodemailer from 'nodemailer'
export async function sendEmailService({
    to,
    subject,
    message,
    attachments=[]
}={}){
    //configurations
    const transporter = nodemailer.createTransport({
        host:'localhost',
        port:587,
        secure:false,
        service:'gmail',
        auth:{
            user:'Kfatmaalzahraa@gmail.com',
            pass:'zxpjbprfownrhvxf'
        }
    })
    const emailInfo = transporter.sendMail({
        from:'"HSM" <Kfatmaalzahraa@gmail.com>',
        to : to ? to : '',
        subject : subject ? subject : '',
        html:message ? message :'',
        attachments
    })
    if(emailInfo.accepted){
        return true
    }
    else{
        return false
    }
}