import { model, Schema } from "mongoose";

export const projectVideoSchema = new Schema(
    {
        video: {
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

export const projectVideoModel = model('projectvideo', projectVideoSchema)