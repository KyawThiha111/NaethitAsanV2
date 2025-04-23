import {v2} from "cloudinary";
import dotenv from "dotenv";
import path from "path"
import { fileURLToPath } from "url";
import fs from "fs";
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
    path:path.join(__dirname,"../.env")
})

v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadFileToCloudinary = async(filepath)=>{
    try {
        if(!filepath) return null;
        const uploadResult = await v2.uploader.upload(
            filepath,{resource_type:"auto"}
        )
         fs.unlinkSync(filepath)
         return uploadResult;
    } catch (error) {
        console.log(`Error while uploading to cloudinary: ${error}`)
        fs.unlinkSync(filepath)
    }
}

export default uploadFileToCloudinary;