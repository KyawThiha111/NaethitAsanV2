import { Schema,model } from "mongoose";
import mongoose from "mongoose";

const facilitiesSchema = new Schema({
    clinicname:{
        type:String,
        required:true,
        unique:false
    },
    openinghr:{
        type:String,
        required:true,
        unique:false
    },
    location:{
    type:String,
    required:true,
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