import { Schema,model } from "mongoose";
import mongoose from "mongoose";

const MissionSchema = new Schema({
    titleen:{
        type:String,
        required:true,
        unique:true
    },
    titlemy:{
        type:String,
        required:true,
        unique:true
    },
    missionen:{
        type:String,
        required:true,
        unique:true
    },
    missionmy:{
        type:String,
        required:true,
        unique:true
    },
    admins:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"admin",
            required:true,
           }
    ]
},{timestamps:true})

const AbouUsMissionCollection = model("aboutusmission",MissionSchema)
export default AbouUsMissionCollection;