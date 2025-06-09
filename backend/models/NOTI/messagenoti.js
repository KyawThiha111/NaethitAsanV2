import {Schema,model} from "mongoose";
import mongoose from "mongoose";

const notiSchmea = new Schema({
    count:{
        type:Number,
        required:true,
        default:0
    },
     admins:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"admin",
                required:true,
               }
        ]
},{timestamps:true})

const notiCollection = model("messagecount",notiSchmea);
export default notiCollection;