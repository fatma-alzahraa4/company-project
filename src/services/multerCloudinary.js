import multer from 'multer'
import { allowedExtensions } from './../utils/allowedEtensions.js';
import sharp from 'sharp';
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
    if (req.file) {
        try {
            const outputFilePath = `uploads/${Date.now()}-converted.webp`;

            await sharp(req.file.path)
                .webp({ quality: 80 })
                .toFile(outputFilePath);

            // Update file info in req.file
            req.file.path = outputFilePath;
            req.file.mimetype = 'image/webp';

            // Clean up the original uploaded file
            fs.unlinkSync(req.file.path);

            next();
        } catch (error) {
            return next(error);
        }
    } else {
        next();
    }
};
