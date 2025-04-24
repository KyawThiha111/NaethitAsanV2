import BlogCollection from "../models/blog.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv"
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
    path:path.join(__dirname,"..",".env")
})
//Create, Update, GetAll, Delete 

export const CreateBlog = async (req, res) => {
    try {
        const adminid = req.adminid;
        const { title, description, blog, postdate, timelength, catagory } = req.body;

        // Validate required fields
        const requiredFields = { title, description, blog, postdate, timelength, catagory };
        const missingFields = Object.entries(requiredFields)
            .filter(([_, value]) => !value)
            .map(([key]) => key);

        if (missingFields.length > 0) {
            fs.unlinkSync(path.join(__dirname,"..","public","Blog",req.file.filename))
            return res.status(400).json({
                success: false,
                message: "Fields required!",
                missingFields
            });
        }

        // Check for existing blog
        const blogExist = await BlogCollection.findOne({ title });
        if (blogExist) {
            fs.unlinkSync(path.join(__dirname,"..","public","Blog",req.file.filename))
            return res.status(409).json({ // 409 Conflict is more appropriate
                success: false,
                message: "Post with this title already exists."
            });
        }

        const toUploadBlog = {
            title,
            description,
            blog,
            postdate,
            timelength,
            catagory,
            admin:adminid,
            ...req.file&&{img:`/public/Blog/${req.file.filename}`}
        }
        // Create new blog
        const createdBlog = await BlogCollection.create(toUploadBlog);

        if (!createdBlog) {
            fs.unlinkSync(path.join(__dirname,"..","public","Blog",req.file.filename))
            return res.status(500).json({
                success: false,
                message: "Error while creating a blog!"
            });
        }
        return res.status(201).json({
            success: true,
            message: "Successfully added a blog!",
            blog: createdBlog
        });
    } catch (error) {
        if(req.file){
            fs.unlinkSync(path.join(__dirname,"..","public","Blog",req.file.filename))
        }
        console.error("Blog creation error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


export const UpdateBlogPost = async(req,res)=>{
   try {
    const {blogid} = req.params;
    const adminid = req.adminid;
    const {title,description,blog,postdate,timelength,catagory} = req.body;

    const requiredFileds = {title,description,blog,postdate,timelength,catagory}
    const missingFields = Object.entries(requiredFileds).filter(([_,value])=>!value).map(([key])=>key);

    if(missingFields.length>0){
        return res.status(400).json({success:false,message:"Fields required!",missingFields})
    }
    // Check if the blog exists and belongs to the admin
    const existingBlog = await BlogCollection.findById(blogid);
    if(!existingBlog){
        return res.status(404).json({success:false,message:"Blog not found!"})
    }
    if(existingBlog.admin.toString()!==adminid){
        return res.status(404).json({success:false,message:"Unauthorized! You can only update your own blogs!"})
    }
    let imgUrl = existingBlog?.img;
    /* For image only if the new file is provided! */
    if(req.file){
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        const ext = path.extname(req.file.originalname).toLowerCase()

        if(!allowedMimeTypes.includes(req.file.mimetype) && ext!==".jfif"){
            fs.unlinkSync(req.file.path)
            return res.status(400).json({success:false,message:"Invalid image format!"})
        }

        /* Delete old image */
        if(existingBlog.img){
           const oldimgPath = path.join(__dirname,"..",imgUrl);
           if(fs.existsSync(oldimgPath)){
            fs.unlinkSync(oldimgPath)
           }
        } 
    }
  /* Get new URL */
     if(req.file){
        imgUrl = `/public/Blog/${req.file.filename}`
     }
    /* Update by checking if the user add a new file or not */
     /* Update the blog */    
    const toUpdateData = {
        title:title,
        description:description,
        blog:blog,
        postdate,
        timelength,
        catagory,
        admin:adminid,
        ...(req.file&&{img:imgUrl})
    }
     /* Update the blog */    
     const updatedBlog = await BlogCollection.findByIdAndUpdate(blogid,toUpdateData,{new:true,runValidators:true})
     if (!updatedBlog) {
        throw new Error("Failed to update blog");
    }
    return res.status(200).json({success:true,message:"Successfully updated the blog!",blog:updatedBlog})
   } catch (error) {
    console.log("Blog updated error",error)

    if(req.file){
        fs.unlinkSync(req.file.path)
    }

    return res.status(500).json({success:false,message:"Internal server error!",error:process.env.NODE_ENV==="development"?error.message:undefined})
   }
}

export const GetAllBlog = async(req,res)=>{
    try {
        const blogs = await BlogCollection.find();
        if(!blogs){
            return res.status(404).json({success:false,message:"Error while getting blogs!"})
        }
        if(blogs.length===0){
            return res.status(200).json({success:true,message:"No blogs to show!"})
        }
        return res.status(200).json({success:true,message:"Blogs are shown",blogs:blogs})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false,error:process.env.NODE_ENV==="development"?error.message:undefined})
    }
}

export const DeleteBlog = async(req,res)=>{
    try {
        const {blogid} = req.params;
        const adminid = req.adminid;

        /* If blog exist */
        const exisitingBlog = await BlogCollection.findById(blogid);
        if(!exisitingBlog){
            return res.status(404).json({success:false,error:"No posts found to delete!"})
        }
        if(exisitingBlog.admin.toString()!==adminid){
            return res.status(403).json({success:false,message:"Only the owner can delete the post!"})
        }
        /* Delete the post from public folder */
        if(exisitingBlog.img){
            const imgUrlToDelete = path.join(__dirname,"..",exisitingBlog.img.startsWith("/")?exisitingBlog.img.slice(1):exisitingBlog.img)
            if(fs.existsSync(imgUrlToDelete)){
                fs.unlinkSync(imgUrlToDelete)
            }
        }

        /* Delete from MongoDB */
        const deletedBlog = await BlogCollection.findByIdAndDelete(blogid)
        if(!deletedBlog){
            throw new Error("Failed to delete the blog!")
        }
        return res.status(200).json({success:true,message:"Blog deleted!"})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false,message:"Internal server error!",error:process.env.NODE_ENV==="development"?error.message:undefined})
    }
}