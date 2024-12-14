import { model, Schema } from "mongoose";

export const contactSchema = new Schema({
    companyName: {
        type: String,
        required: true,
        minlength: 3,
    },
    CompanyEmail: {
        type: String,
        required: true,
    },
    phoneNum: {
        type: String,
        required: true,
        minlength: 4,
    },
    note:{
        type: String,
    },
    IP:{
      type:String,
      required:true  
    },
    service:{
        type:String,
        required:true
    }
    
   
}, 
{ timestamps: true })

export const contactModel = model('Contact',contactSchema)