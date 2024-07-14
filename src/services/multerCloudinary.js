import multer from 'multer'
import { allowedExtensions } from './../utils/allowedEtensions.js';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';

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




const convertVideoToWebP = async (file) => {
  const inputFilePath = file.path;
  const outputFilePath = path.join(path.dirname(inputFilePath), `${path.parse(file.originalname).name}.webp`);
  // console.log(inputFilePath);
  // console.log(outputFilePath);

  return new Promise((resolve, reject) => {
    ffmpeg(inputFilePath)
      .inputOptions(['-vf', 'scale=640:-1', '-loop 0', '-r 30'])
      .toFormat('webp')
      .on('end', () => {
        file.path = outputFilePath;
        file.mimetype = 'video/webp';
        resolve();
      })
      .on('error', (err) => {
        reject(new Error(`FFmpeg conversion failed: ${err.message}`));
      })
      .save(outputFilePath);
  });
};


const convertImageToWebP = async (file) => {
  const inputFilePath = file.path;
  const outputFilePath = path.join(path.dirname(inputFilePath), `${path.parse(file.originalname).name}.webp`);
  try {
    await sharp(inputFilePath).toFile(outputFilePath);

    // Unlink the original file
    // fs.unlinkSync(inputFilePath);

    // Update file object to point to the new file
    file.path = outputFilePath;
    file.mimetype = 'image/webp';
  } catch (error) {
    throw new Error(`WebP conversion failed: ${error.message}`);
  }
};

export const convertToWebP = async (req, res, next) => {
  try {
    if (req.file) {
      if (req.file.mimetype.startsWith('image/')) {
        await convertImageToWebP(req.file);
      }
      else if (req.file.mimetype.startsWith('video/')) {
        await convertVideoToWebP(req.file);
      }
      // For single video files, just call next as we don't convert videos
    } else if (req.files) {
      // Extract all fields from req.files object
      const fileFields = Object.keys(req.files);

      // Process each field
      for (const fieldName of fileFields) {
        const file = req.files[fieldName][0]; // Assuming maxCount is 1 per field
        
        if (file.mimetype && file.mimetype.startsWith('image/')) {
          await convertImageToWebP(file);
        }
        else if (file.mimetype.startsWith('video/')) {
          console.log("videooo");
          await convertVideoToWebP(file);
        }
        // You can add handling for other file types here if needed
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};


