import { generalFields } from "../../middleWares/validation";
import joi from 'joi'

export const addJobOfferSchema = {
    body: joi.object({
        jobTitle: joi.string().min(2).required(),
        address: joi.string().min(3).required(),
        employmentType: joi.string().min(3).required(),
        experienceYears: joi.string().required(),
        jobDetails: joi.string().min(3).required(),
        acceptedKeyWords: joi.array(),
        rejectedKeyWords: joi.array(),
    }).required()
}

export const editJobOfferSchema = {
    body: joi.object({
        jobTitle: joi.string().min(2),
        address: joi.string().min(3),
        employmentType: joi.string().min(3),
        experienceYears: joi.string(),
        jobDetails: joi.string().min(3),
        acceptedKeyWords: joi.array(),
        rejectedKeyWords: joi.array(),
    }).required()
}

export const deleteJobOfferSchema = {
    params: joi.object({
        jobId: generalFields._id.required(),
    }).required(),
}

export const getJobOfferSchema = {
    params: joi.object({
        jobId: generalFields._id.required(),
    }).required(),
}


export const deleteJobApplicantSchema = {
    params: joi.object({
        jobApplicantId: generalFields._id.required(),
    }).required(),
}

export const getJobApplicantsSchema = {
    params: joi.object({
        jobId: generalFields._id.required(),
    }).required(),
}

export const applyToJobSchema = {
    body: joi.object({
        firstName: joi.string().min(3).required(),
        lastName: joi.string().min(3).required(),
        address: joi.string().min(3).required(),
        email: generalFields.email.required(),
        phoneNumber: generalFields.phoneNumbers.required(),
        portofolio: joi.string().uri(),
        linkedIn: joi.string().uri(),
        resume: joi.string().uri().required(),
    }).required()
}

