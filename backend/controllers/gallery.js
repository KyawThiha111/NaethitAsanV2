import GalleryCollection from "../models/gallery.js";
import uploadFileToCloudinary from "../utils/cloudinary.js";
import fs from "fs";
import path from "path"
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const publicUploadDir = path.join(__dirname,"../public");
//Create admin
//Render all
//Update admin
//Delete admin

if(!fs.existsSync(publicUploadDir)){
    fs.mkdirSync(publicUploadDir,{recursive:true})
}
export const AddGallery = async(req,res)=>{
    const {title,description} = req.body;
    const adminid = req.adminid;
    const position = req.position;
    try {
        const reqfile = req.file;
        if(!title||!description){
            return res.status(400).json({success:false,message:"Fields required!"})
        }
        const postExist = await GalleryCollection.findOne({title})
        if(postExist){
            return res.status(403).json({success:false,message:"Post with this title exist!"})
        }
       let imgUrl = null;
       if(reqfile){
        let photoResult = await uploadFileToCloudinary(reqfile.path)
        imgUrl = photoResult.url;
    }
    let createdPost;
      if(req.body.catagory){
         createdPost = await GalleryCollection.create({img:imgUrl,title,description,catagory:req.body.catagory,accessto:position,admin:adminid}) 
    }else{
         createdPost = await GalleryCollection.create({img:imgUrl,title,description,accessto:position,admin:adminid})
    }
    return res.status(201).json({success:true,message:"Uploaded a post to your gallery",post:createdPost})
    } catch (error) {
      return res.status(500).json({success:false,error:error.message})
    }
}

export const UpdateGallery = async(req,res)=>{
    const {title,description,catagory} =req.body;
    const reqFile = req.file;
    const id = req.params.id;
   const adminid = req.adminid;
   const position = req.position;
   try {
    const foundpost = await GalleryCollection.findById(id)
    if (!foundpost) {
        fs.unlinkSync(reqFile.path)
        return res.status(404).json({ success: false, message: "Post not found!" });
    }  
    if(title&& title!==foundpost.title){
        const sametitleexist = await GalleryCollection.findOne({title});
        if(sametitleexist&&sametitleexist._id!==id){
            fs.unlinkSync(reqFile.path)
            return res.status(403).json({success:false,message:"Post with this title already exists!"})
        }
    }
    let imgUrl = null;
    if(reqFile){
        let photoResult = await uploadFileToCloudinary(reqFile.path)
        imgUrl=photoResult.url;
    }
     const updatedPost = await GalleryCollection.findByIdAndUpdate(id,{...req.body,img:imgUrl},{new:true,runValidators:true})
     if (!updatedPost) {
        return res.status(404).json({ success: false, message: "Post not updated!" });
      }
      return res.status(200).json({ success: true, message: "Gallery updated!", post: updatedPost });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
   }
}

const allowMimeTypes = ["image/jpeg","image/png","image/webp","application/octet-stream"]
export const AsanAddGallery = async(req,res)=>{
    const {title,description,catagory} = req.body;
    const reqFile = req.file;
    const adminid = req.adminid;
    const position = req.position
   console.log(reqFile.filename)
  /*   try {
        if(!title||!description||!catagory){
            return res.status(400).json({ success: false, message: "Fields required!" });
        }
        const postExist = await GalleryCollection.findOne({ title });
        if (postExist) {
          return res.status(409).json({ success: false, message: "Post with this title exists!" });
        } 
    } catch (error) {
        
    } */
}