import { model, Schema } from "mongoose";

export const IPSchema = new Schema({
    iPAddress: {
        type: String,
        required: true
    },
    time: {
        type: String,
    },
},
    { timestamps: true })

export const IPModel = model('IP', IPSchema)