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
            user:process.env.SENDEMAIL_EMAIL,
            pass:process.env.SENDEMAIL_PASSWORD
        }
    })
    const emailInfo = transporter.sendMail({
        from:`"HSM" <${process.env.SENDEMAIL_EMAIL}>`,
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