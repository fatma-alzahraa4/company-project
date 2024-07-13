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
            maxlength: 100
        }
    },
    customId:String,
    qoute:{
        type:String
    },
    
},
{ timestamps: true })

export const teamModel = model('Team',teamSchema)