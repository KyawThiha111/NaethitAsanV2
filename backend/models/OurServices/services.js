import { Schema, model} from "mongoose";
import mongoose from "mongoose";
import path from "path"
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//The document with default data will be created when you signup.
const servicesSchema = new Schema({
    img:{
        type:String,
        required:false,
    },
    logo:{
        type:String,
        required:false,
    },
    title_en:{
        type:String,
        unique:true,
        required:true
    },
    title_my:{
        type:String,
        unique:true,
        required:true
    },
    subtitle_en:{
        type:String,
        required:true
    },
    subtitle_my:{
        type:String,
        required:true
    },
    description_en:{
        type:String,
        required:false
    },
    description_my:{
        type:String,
        required:false
    },
    showonhomepage:{
        type:String,
        required:false,
        default:"false"
    },
    admins:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"admin",
            required:true,
           }
    ] 
},{timestamps:true})

const servicesCollection = model("ourservice",servicesSchema)
export default servicesCollection;