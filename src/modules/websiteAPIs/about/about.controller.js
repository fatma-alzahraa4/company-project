import { aboutModel } from "../../../../DB/models/aboutUsModel.js";
import { getOrSetCache } from "../../../utils/redis.js";

export const aboutData = async (req, res, next) => {
    const about = await getOrSetCache(`aboutWebsite`, async () => {
        const about = await aboutModel.findOne()
            .select(`
            -updatedAt 
            -__v 
            -missionVisionImage.public_id 
            -missionVisionImage.customId 
            -ourStoryImage1.public_id 
            -ourStoryImage1.customId 
            -ourStoryImage2.public_id 
            -ourStoryImage2.customId 
            -ourValueImage.public_id 
            -ourValueImage.customId 
            -whyUsImage1.public_id 
            -whyUsImage1.customId 
            -whyUsImage2.public_id 
            -whyUsImage2.customId
            `)
        if (!about) {
            return next(new Error('No about data found in the database. Please ensure that the about data exists.', { cause: 404 }))
        }
        const formattedHW = about.howWeWork.map(hw => ({
            title: hw.title,
            desc: hw.desc,
            image: {
                secure_url: hw.image.secure_url,
                alt: hw.image.alt,
            }

        }));
        const updatedUbout = {...about.toObject(),howWeWork:formattedHW}
        const data = { updatedUbout }
        return data;
    })
    res.status(200).json({ message: 'Done', ...about })
}
