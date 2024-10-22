import { model, Schema } from "mongoose";

export const subServiceSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    brief:{
        type:String,
    },
    serviceId:{
        type:Schema.Types.ObjectId,
        ref:'Service',
    },
    active:{
        type:Boolean,
        required:true,
        default:true
    },
   
}, 
{ timestamps: true })

export const subServiceModel = model('SubService',subServiceSchema)