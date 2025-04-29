import {Schema,model} from "mongoose";
import mongoose from "mongoose";

const BlogSchema = new Schema({
    img:{
        type:String,
    },
    titleen:{
        type:String,
        maxLength:[250,"Title must not be longer than 80 characters."],
        required:true
    },
    titlemy:{
        type:String,
        maxLength:[250,"Title must not be longer than 80 characters."],
        required:true
    },
    descriptionen:{
      type:String,
      required:true,
      maxLength:[350,"Description must not be longer than 200 characters."]
    },
    descriptionmy:{
      type:String,
      required:true,
      maxLength:[350,"Description must not be longer than 200 characters."]
    },
    blogen:{
      type:String,
      required:true
    },
    blogmy:{
      type:String,
      required:true
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
        enum:["All","Community","Volunteers","Research","Partnerships"]
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