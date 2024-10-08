import { model, Schema } from "mongoose";

export const projectSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            minlength: 2,
        },
        mainImage: {
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
        clientName: {
            type: String,
            required: true
        },
        projectLink: {
            type: String,
            required: true
        },
        clientLink: {
            type: String,
            required: true
        },
        details: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['Pending', 'InProgress', 'Completed'],
            default: 'Pending',
        },
        progressPercentage : {
            type: Number,
            min: 0,
            max: 100,
            required: function () {
                return this.status === 'InProgress';
            }
        },
        projectFolder:String
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

projectSchema.virtual('images',{
    ref:'projectimage',
    localField:'_id',
    foreignField:'projectId',
});

projectSchema.virtual('videos',{
    ref:'projectvideo',
    localField:'_id',
    foreignField:'projectId',
})
export const projectModel = model('project', projectSchema)