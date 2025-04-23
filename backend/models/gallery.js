import mongoose from "mongoose";
import {Schema,model} from "mongoose";

const gallerySchema = new Schema({
    img:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        maxLength:[100,"Title must not be longer than 100 characters."],
        required:true,
        unique:true
    },
    description:{
        type:String,
        maxLength:[200,"Title must not be longer than 200 characters."],
        required:true,
    },
    catagory:{
        type:String,
        default:"All",
        enum:["All","Events","Volunteers","Community","Causes"]
    },
    accessto:{
        type:String,
        required:true
    },
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"admin",
        required:true
    }
},{timestamps:true})

const GalleryCollection = model("gallery",gallerySchema)
export default GalleryCollection;