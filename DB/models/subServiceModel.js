import { model, Schema } from "mongoose";

export const subServiceSchema = new Schema({
    name:{
        type:String,
        required:true,
        lowercase:true,
    },
    brief:{
        type:String,
    },
    serviceId:{
        type:Schema.Types.ObjectId,
        ref:'Service',
    },
   
}, 
{ timestamps: true })

export const subServiceModel = model('SubService',subServiceSchema)