import { serviceModel } from "../../../../DB/models/serviceModel.js"

export const getServices = async (req,res,next)=>{
    const services = await serviceModel.find({ active: true })
    return res.status(200).json({ message: 'Done', services })
}