import { model, Schema } from "mongoose";

export const aboutSchema = new Schema({
    mission:{
        type:String,
        required:true,
    },
    vission:{
        type:String,
        required:true,
    },
    ourStory:{
        type:String,
        required:true,
    },
    ourValue:{
        type:String,
        required:true,
    },
    whyUs:{
        type:String,
        required:true,
    },
    whyUsImage1: {
        secure_url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        },
        customId:String,
        alt:{
            type:String,
            maxlength: 100
        }
    },   
    whyUsImage2: {
        secure_url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        },
        customId:String,
        alt:{
            type:String,
            maxlength: 100
        }
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
}, 
{ timestamps: true })

export const aboutModel = model('About',aboutSchema)