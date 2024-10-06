import { model, Schema } from "mongoose";

export const projectImageSchema = new Schema(
    {
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
        projectId:{
            type:Schema.Types.ObjectId,
            required:true,
            ref:'project'
        }
    },
    {
        timestamps: true,
    }
)

export const projectImageModel = model('projectimage', projectImageSchema)