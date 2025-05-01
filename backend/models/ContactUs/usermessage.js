import { Schema,model } from "mongoose";
import mongoose from "mongoose";

const userMessageSchema = new Schema({
    firstname:{
        type:String,
        required:true,
        unique:false
    },
    lastname:{
        type:String,
        required:false,
        unique:false
    },
    email:{
        type:String,
        required:true,
        unique:false
    },
    phone:{
        type:String,
        required:true,
        unique:false
    },
    subject:{
        type:String,
        enum:["General Inquiry","Donation Question","Volunteer Opputunity","Partnership Inquiry"],
        required:true,
        unique:false
    },
    message:{
        type:String,
        required:true,
        unique:false
    },
    admins:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"admin",
            required:true,
           }
    ]
},{timestamps:true})

const UserMessageCollection = model("usermessage",userMessageSchema)
export default UserMessageCollection;