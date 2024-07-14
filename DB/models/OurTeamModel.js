import { model, Schema } from "mongoose";

export const teamSchema = new Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        minlength: 3,
        maxlength: 15
    },
    position:{
        type: String,
        required: true,
        lowercase: true,
        minlength: 3,
        maxlength: 25
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
        alt:{
            type:String,
            maxlength: 100,
            required: true
        }
    },
    customId:String,
    qoute:{
        type:String
    },
    active:{
        type:Boolean,
        required:true,
        default:true
    },
    
},
{ timestamps: true })

export const teamModel = model('Team',teamSchema)