import { model, Schema } from "mongoose";

export const contactSchema = new Schema({
    companyName: {
        type: String,
        required: true,
        lowercase: true,
        minlength: 3,
        // maxlength: 25
    },
    CompanyEmail: {
        type: String,
        required: true,
    },
    phoneNum: {
        type: String,
        required: true,
        minlength: 4,
        // maxlength: 15
    },
    note:{
        type: String,
    },
    IP:{
      type:String,
      required:true  
    },
    subService:{
        type:String,
        required:true
    }
    
   
}, 
{ timestamps: true })

export const contactModel = model('Contact',contactSchema)