import { Schema,model } from "mongoose";
import mongoose from "mongoose";

const facilitiesSchema = new Schema({
    clinicname_en:{
        type:String,
        required:true,
        unique:true
    },
    clinicname_my:{
        type:String,
        required:true,
        unique:true
    },
    openinghr_en:{
        type:String,
        required:true,
        unique:false
    },
    openinghr_my:{
        type:String,
        required:true,
        unique:false
    },
    mapurl:{
    type:String,
    required:true
    },
    photo:{
       type:String,
       required:true
    },
    admins:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"admin",
            required:true,
           }
    ]
},{timestamps:true})

const facilitiesCollection = model("ourfacility",facilitiesSchema)
export default facilitiesCollection;