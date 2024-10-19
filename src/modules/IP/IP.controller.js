import { IPModel } from "../../../DB/models/IPModel.js"
import { clientRedis, getOrSetCache } from "../../utils/redis.js"

export const newIPAddress = async(req,res,next)=>{
    const {iPAddress,time} = req.body
    if(!iPAddress||!time){
        return next(new Error('please enter all required data', { cause: 400 }))
    }
    const newIP =await IPModel.create({iPAddress,time})
    if(!newIP){
        return next(new Error('creation failed', { cause: 400 }))
    }
    clientRedis.del('IPAddressesDashBoard');
    res.status(200).json({ message: 'Done', newIP })
}

export const getIPAddresses = async (req,res,next)=>{
    const IPAddresses = await getOrSetCache('IPAddressesDashBoard', async ()=>{
        const IPAddresses = await IPModel.find()
        const data = {IPAddresses}
        return data
    })
    res.status(200).json({ message: 'Done', ...IPAddresses })

}