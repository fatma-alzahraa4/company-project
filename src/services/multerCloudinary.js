import multer from 'multer'
import { allowedExtensions } from './../utils/allowedEtensions.js';
import gm from 'gm';
import path from 'path';
import fs from 'fs';

export const multerCloudFunction = (allowedExtensionsArr)=>{
    if(!allowedExtensionsArr){
        allowedExtensionsArr = allowedExtensions.Image
    }
    const storage = multer.diskStorage({})
    const fileFilter = function(req,file,cb){
        if(allowedExtensionsArr.includes(file.mimetype)){
            return cb(null,true)
        }
        cb (new Error('invalid extension',{cause:400}),false)
    }
    const fileUpload = multer({fileFilter,storage})
    return fileUpload
}


export const convertToWebP = async (req, res, next) => {
    try {
        if (!req.file) {
            throw new Error('No file uploaded');
        }

        gm(req.file.path)
            .setFormat('webp')
            .write(`${req.file.path}.webp`, (err) => {
                if (err) throw err;
                req.file.path = `${req.file.path}.webp`;
                next();
            });
    } catch (err) {
        next(new Error(`Error converting image to WebP: ${err.message}`));
    }

};


