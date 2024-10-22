import { model, Schema } from "mongoose";

export const teamSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
    },
    position: {
        type: String,
        required: true,
        minlength: 3,
    },
    image: {
        secure_url: {
            type: String,
            required: true
        },
        public_id: {
            type: String,
            required: true
        },
        alt: {
            type: String,
            required: true
        },
        customId: String,
    },
    qoute: {
        type: String
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },

},
    { timestamps: true })

export const teamModel = model('Team', teamSchema)