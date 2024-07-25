import { model, Schema } from "mongoose";

export const aboutSchema = new Schema({
    mission: {
        type: String,
        required: true,
    },
    missionTitle: {
        type: String,
        required: true,
    },
    vission: {
        type: String,
        required: true,
    },
    vissionTitle: {
        type: String,
        required: true,
    },
    ourStory: {
        type: String,
        required: true,
    },
    ourStoryTitle: {
        type: String,
        required: true,
    },
    ourValue: {
        type: String,
        required: true,
    },
    ourValueTitle: {
        type: String,
        required: true,
    },
    whyUsTitle: {
        type: String,
        required: true,
    },
    whyUsDesc: {
        type: String,
        required: true,
    },
    whyUsSubtitle: {
        type: String,
        required: true,
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
        customId: String,
        alt: {
            type: String,
            required: true,
            // maxlength: 100
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
        customId: String,
        alt: {
            type: String,
            required: true,
            // maxlength: 100
        }
    },
    metaDesc: {
        type: String,
        // maxlength: 200,
        required: true,
    },
    metaKeyWords: {
        type: String,
        // maxlength: 250,
    },
    howWeWorkMainTitle: {
        type: String,
        required: true,
    },
    howWeWork: [{
        title: {
            type: String,
            required: true,
        },
        desc: {
            type: String,
            required: true,
        },
        image:{
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
                required: true,
            },
            customId: String,
        }
    }]
},
    { timestamps: true })

export const aboutModel = model('About', aboutSchema)