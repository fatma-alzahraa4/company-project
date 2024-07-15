import { model, Schema } from "mongoose";

export const companySchema = new Schema({
    companyName: {
        type: String,
        required: true,
        lowercase: true,
        minlength: 3,
        maxlength: 25
    },
    email: {
        type: String,
        required: true,
    },
    phoneNum: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 15
    },
    logo: {
        secure_url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        },
        // alt:{
        //     type:String,
        //     maxlength: 100,
        //     required: true
        // }
    },
    landLine: {
        type: String,
        minlength: 4,
        maxlength: 15
    },
    mapLink: {
        type: String
    },
    metaDesc:{
        type:String,
        maxlength: 200,
        required: true,
    },
    metaKeyWords:{
        type:String,
        maxlength: 250,
    },
    Facebook: String,
    Instagram: String,
    Twitter: String,
    Linkedin: String,
    SnapChat: String,
    Tiktok: String,
    customId:String,

},
    { timestamps: true })

export const companyModel = model('Company', companySchema)