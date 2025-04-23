import {Schema,model} from "mongoose";
import mongoose from "mongoose";

const BlogSchema = new Schema({
    img:{
        type:String,
    },
    title:{
        type:String,
        maxLength:[80,"Title must not be longer than 80 characters."],
        unique:true,
        required:true
    },
    description:{
      type:String,
      required:true,
      maxLength:[200,"Description must not be longer than 200 characters."]
    },
    blog:{
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
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"admin",
        required:true
    }
},{timestamps:true})

const BlogCollection = model("blog",BlogSchema)
export default BlogCollection;