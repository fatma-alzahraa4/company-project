import { model, Schema } from "mongoose";

export const clientSchema = new Schema({
    companyName: {
        type: String,
        required: true,
        lowercase: true,
        minlength: 3,
        maxlength: 25
    },
    details:{
        type:String
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
            maxlength: 100,
            required: true
        }
    },
    customIdImage:String,
    video:{
        secure_url: {
            type: String,
        },
        public_id: {
            type: String,
        },
        alt:{
            type:String,
            maxlength: 100,
        }
    },
    customIdVideo:String,
    teamId:[{
        type:Schema.Types.ObjectId,
        ref:'Team',
    }]
},
{ timestamps: true })

export const clientModel = model('Client',clientSchema)