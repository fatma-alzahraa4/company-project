import { aboutModel } from "../../../../DB/models/aboutUsModel.js";
import { getOrSetCache } from "../../../utils/redis.js";

export const aboutData = async (req, res, next) => {
    const about = await getOrSetCache(`aboutWebsite`, async () => {
        const about = await aboutModel.findOne()
        if (!about) {
            return next(new Error('no about data found', { cause: 400 }))
        }
        const data = {about}
        return data;
    })
    res.status(200).json({ message: 'Done', ...about })
}
