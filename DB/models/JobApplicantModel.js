import { model, Schema } from "mongoose";
const jobApplicantSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        resume: {
            secure_url: {
                type: String,
                required: true
            },
            public_id: {
                type: String,
                required: true
            },
            customId: String,
        },
        jobId:{
            type:Schema.Types.ObjectId,
            ref:'job_offer',
            required:true
        },
        portofolio: String,
        linkedIn: String
    },
    {
        timestamps: true
    })

export const jobApplicantModel = model('job_applicant', jobApplicantSchema)