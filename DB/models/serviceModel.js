import { model, Schema } from "mongoose";

export const serviceSchema = new Schema({
    name:{
        type:String,
        required:true,
        lowercase:true
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
            maxlength: 100
        }
    },
    customId:String,
}, 
{ 
    toObject:{virtuals:true},
    toJSON:{virtuals:true},
    timestamps: true 
})
serviceSchema.virtual('subServices',{
    ref:'SubService',
    localField:'_id',
    foreignField:'serviceId'
})
export const serviceModel = model('Service',serviceSchema)