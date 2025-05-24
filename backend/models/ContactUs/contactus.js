import {Schema, model} from "mongoose";
import mongoose from "mongoose";

const ContactusSchema = new Schema({
    primary_phone_number:{
        type:String,
        required:true,
        default:"+95 9 771 876 404"
    },
    secondary_phone_number:{
        type:String,
        required:false,
    },
    tertiary_phone_number:{
        type:String,
        required:false,
    },
    primary_email:{
        type:String,
        required:true,
        default:"info@naethit.org"
    },
    secondary_email:{
        type:String,
        required:false,
    },
    tertiary_email:{
        type:String,
        required:false,
    },
    head_office_1:{
        type:String,
        required:true,
        default:" No. 661, Innwa 19th Street (A), Ward 6, South Okkalapa Township, Yangon."
    },
    head_office_2:{
        type:String,
        required:false
    },
    head_office_3:{
        type:String,
        required:false
    },
    weekdays_office_hr:{
        type:String,
        required:true,
        default:"9:00 AM - 5:00 PM"
    },
    sat_office_hr:{
        type:String,
        required:true,
        default:"9:00 AM - 12:00 PM"
    },
    sun_office_hr:{
        type:String,
        required:true,
        default:"closed"
    },
    admins:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"admin",
            required:true,
        }
    ]
},{timestamps:true})

const ContactusCollection = model("contactusdata",ContactusSchema);
export default ContactusCollection;
