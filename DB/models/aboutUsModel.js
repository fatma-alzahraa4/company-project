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
    missionVisionImage:{
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
    },
    ourStory: {
        type: String,
        required: true,
    },
    ourStoryTitle: {
        type: String,
        required: true,
    },
   ourStoryImage1:{
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
    },
    ourStoryImage2:{
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
    },
    ourValue: {
        type: String,
        required: true,
    },
    ourValueTitle: {
        type: String,
        required: true,
    },
    ourValueImage:{
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
        alt: {
            type: String,
            required: true,
        },
        customId: String,
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
        alt: {
            type: String,
            required: true,
        },
        customId: String,
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