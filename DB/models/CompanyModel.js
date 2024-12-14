import { model, Schema } from "mongoose";

export const companySchema = new Schema({
    companyName: {
        type: String,
        required: true,
        minlength: 3,
    },
    email: {
        type: String,
        required: true,
    },
    phoneNum: {
        type: String,
        required: true,
        minlength: 4,
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
        alt: {
            type: String,
            required: true
        },
        customId: String,
    },
    landLine: {
        type: String,
        minlength: 4,
    },
    address: {
        type: String,
        required: true,
    },
    mapLink: {
        type: String
    },
    metaDesc: {
        type: String,
        required: true,
    },
    metaKeyWords: {
        type: String,
    },
    slogan: {
        type: String,
        required: true
    },
    contactUsImage: {
        secure_url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        },
        alt: {
            type: String,
            required: true
        },
        customId: String,
    },
    Facebook: String,
    Instagram: String,
    Twitter: String,
    Linkedin: String,
    SnapChat: String,
    Tiktok: String,

},
    { timestamps: true })

export const companyModel = model('Company', companySchema)