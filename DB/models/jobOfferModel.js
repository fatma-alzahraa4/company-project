import { model, Schema } from "mongoose";
const jobOfferSchema = new Schema(
    {
        jobTitle: {
            type: String,
            required:true,
        },
        address: {
            type: String,
            required:true,
        },
        employmentType: {
            type: String,
            required: true,
        },
        experienceYears: {
            type: String,
            required: true,
        },
        jobDetails: {
            type: String,
            required: true,
        },
        acceptedKeyWords:[{
            type: String,
        }],
        rejectedKeyWords:[{
            type: String,
        }],
    },
    {
        timestamps: true
    })

export const jobOfferModel = model('job_offer', jobOfferSchema)