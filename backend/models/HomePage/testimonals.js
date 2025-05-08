import {Schema,model} from "mongoose"
import mongoose from "mongoose";

const TestimonalSchema = new Schema({
    note_en:{
        type:String,
        required:true,
        unique:false
    },
    note_my:{
        type:String,
        required:true,
        unique:false
    },
    patient_name_en:{
        type:String,
        required:true,
        unique:false
    },
    patient_name_my:{
        type:String,
        required:true,
        unique:false
    },
    patient_type_en:{
        type:String,
        required:true,
        unique:false
    },
    patient_type_my:{
        type:String,
        required:true,
        unique:false
    },
    admins:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"admin",
            required:true
        }
    ]
},{timestamps:true})

const TestimonalCollection = model("testimonal",TestimonalSchema);
export default TestimonalCollection;