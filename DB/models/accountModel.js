import { model, Schema } from "mongoose";
const accountSchema = new Schema(
    {
        firstName: {
            type: String,
            required:true,
            lowercase:true
        },
        lastName: {
            type: String,
            required:true,
            lowercase:true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase:true,
        },
        phoneNumber: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        role:{
            type:String,
            enum:['superAdmin','admin','editor','customerService']

        },
        profileImage: {
            secure_url: {
                type: String,
            },
            public_id: {
                type: String,
            },
            customId: String,
        },
        isVerified:{
            type:Boolean,
            required:true,
            default:false
        },
        changePasswordTime:Date,
        token:String,
        forgetCode:String,
        verificationCode:String,
        ipVerificationCode:String
    },
    {
        timestamps: true
    })

export const accountModel = model('account', accountSchema)