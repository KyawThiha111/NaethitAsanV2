import mongoose from "mongoose";
import {Schema,model} from "mongoose"

const adminSchema = new Schema({
   adminname:{
    type:String,
    required:true
   },
   email:{
    type:String,
    required:true,
   },
   password:{
    type:String,
    required:true
   },
   position:{
    type:String,
    default:"admin",
    enum:["admin","editor"]
   },
   lastLoginDate:{
    type:Date,
    default:Date.now()
   },
   isVerified:{
    type:Boolean,
    default:false
   },
   resetpassowordToken:String,
   resetpassowordTokenExpiresAt:Date,
   verificationToken:String,
   verificationTokenExpiresAt:Date,
   loginVerificationToken:String,
   loginVerificationTokenExpiresAt:Date
},{timestamps:true})

const adminCollection = model("admin",adminSchema)
export default adminCollection;