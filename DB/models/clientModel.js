import { model, Schema } from "mongoose";

export const clientSchema = new Schema({
    companyName: {
        type: String,
        required: true,
        minlength: 3,
    },
    details:{
        type:String
    },
    companyLink: {
        type: String,
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
        alt:{
            type:String,
            required: true
        },
        customId:String,
    },
    teamId:[{
        type:Schema.Types.ObjectId,
        ref:'Team',
    }],
    isExpertise:{
        type:Boolean,
        required:true,
        default:false
    },
    active:{
        type:Boolean,
        required:true,
        default:true
    },
},
{ timestamps: true })

export const clientModel = model('Client',clientSchema)