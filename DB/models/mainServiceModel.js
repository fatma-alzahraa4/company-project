import { model, Schema } from "mongoose";

export const mainServiceSchema = new Schema({
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
        // alt:{
        //     type:String,
        //     maxlength: 100,
        //     required: true
        // }
    },
    active:{
        type:Boolean,
        required:true,
        default:true
    },
    customId:String,
}, 
{ 
    toObject:{virtuals:true},
    toJSON:{virtuals:true},
    timestamps: true 
})
mainServiceSchema.virtual('services',{
    ref:'Service',
    localField:'_id',
    foreignField:'mainServiceId'
})
export const mainServiceModel = model('MainService',mainServiceSchema)