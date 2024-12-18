import joi from "joi"
import { generalFields } from "../../middleWares/validation.js"
export const addAboutSchema ={
    body:joi.object({
        mission:joi.string().min(3).required(),
        missionTitle:joi.string().min(3).required(),
        vission:joi.string().min(3).required(),
        vissionTitle:joi.string().min(3).required(),
        ourStory:joi.string().min(3).required(),
        ourStoryTitle:joi.string().min(3).required(),
        ourValue:joi.string().min(3).required(),
        ourValueTitle:joi.string().min(3).required(),
        whyUsTitle:joi.string().min(3).required(),
        whyUsDesc:joi.string().min(3).required(),
        whyUsSubtitle:joi.string().min(3).required(),
        metaDesc:joi.string().min(3).required(),
        metaKeyWords:joi.string().min(3), 
        howWeWorkMainTitle:joi.string().min(3),
        howWeWorkArr:joi.array(),
        howWeWorkAlt:joi.string().min(3),
        whyUsImage1Alt:joi.string().min(3).required(),  
        whyUsImage2Alt:joi.string().min(3).required(),  

        missionVisionAlt:joi.string().min(3).required(),  
        ourStoryAlt:joi.string().min(3).required(),  
        ourValueAlt:joi.string().min(3).required(),  

    }).required()
}

export const editAboutSchema ={
    body:joi.object({
        mission:joi.string().min(3),
        missionTitle:joi.string().min(3),
        vission:joi.string().min(3),
        vissionTitle:joi.string().min(3),
        ourStory:joi.string().min(3),
        ourStoryTitle:joi.string().min(3),
        ourValue:joi.string().min(3),
        ourValueTitle:joi.string().min(3),
        whyUsTitle:joi.string().min(3),
        whyUsDesc:joi.string().min(3),
        whyUsSubtitle:joi.string().min(3),
        metaDesc:joi.string().min(3),
        metaKeyWords:joi.string().min(3), 
        howWeWorkMainTitle:joi.string().min(3),
        howWeWorkArr:joi.array(),
        howWeWorkAlt:joi.string().min(3),
        metaKeyWords:joi.string().min(3),   
        whyUsImage1Alt:joi.string().min(3),  
        whyUsImage2Alt:joi.string().min(3),  

        missionVisionAlt:joi.string().min(3),  
        ourStoryAlt:joi.string().min(3),  
        ourValueAlt:joi.string().min(3),  
    }).required()
}

export const addHowWeWorkSchema ={
    body:joi.object({
        title:joi.string().required(),
        desc:joi.string().required(),
        altImage:joi.string().required()
    }).required()
}

export const editHowWeWorkSchema ={
    params:joi.object({
        howWeWorkId:generalFields._id.required()
    }).required(),
    body:joi.object({
        title:joi.string(),
        desc:joi.string(),
        altImage:joi.string()
    }).required()
}

export const deleteHowWeWorkSchema ={
    params:joi.object({
        howWeWorkId:generalFields._id.required()
    }).required(),
}
