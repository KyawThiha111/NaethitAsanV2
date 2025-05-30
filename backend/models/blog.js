import {Schema,model} from "mongoose";
import mongoose from "mongoose";

const BlogSchema = new Schema({
    img:{
        type:String,
    },
    titleen:{
        type:String,
        maxLength:[400,"Title must not be longer than 400 characters."],
        required:true
    },
    titlemy:{
        type:String,
        maxLength:[400,"Title must not be longer than 400 characters."],
        required:true
    },
    descriptionen:{
      type:String,
      required:true,

    },
    descriptionmy:{
      type:String,
      required:true,
    },
    postdate:{
        type:Date,
        required:true
    },
    timelength:{
        type:String,
        required:true
    },
    catagory:{
        type:String,
        required:true,
    },
     admins:[
           {
               type:mongoose.Schema.Types.ObjectId,
               ref:"admin",
               required:true,
              }
       ]
},{timestamps:true})

const BlogCollection = model("blog",BlogSchema)
export default BlogCollection;