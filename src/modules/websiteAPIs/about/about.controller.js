import { aboutModel } from "../../../../DB/models/aboutUsModel.js";
// import { getOrSetCache } from "../redis.js";

export const aboutData = async (req, res, next) => {
    const about = await aboutModel.findOne()
    if (!about) {
        return next(new Error('no about data found', { cause: 400 }))
    }
    res.status(200).json({ message: 'Done', about })
}
