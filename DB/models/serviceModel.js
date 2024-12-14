import { model, Schema } from "mongoose";

export const serviceSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    brief:{
        type:String,
    },
    icon:{
        secure_url:{
            type:String,
            required:true
        },
        public_id:{
            type:String,
            required:true
        },
        alt:{
            type:String,
            required: true
        },
        customId:String
    },
    isHome:{
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

export const serviceModel = model('service',serviceSchema)