import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

dotenv.config({
 path:path.join(__dirname,"../.env")
})

export const checkAuthMiddleware = (req,res,next)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader||!authHeader?.startsWith("Bearer")){
     return res.status(401).json({success:false,error:"Unauthorized!"})
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
     if(err){
         console.log(err)
         return res.status(403).json({success:false,message:"An unknown error occured!"})
     }
     req.adminid = decoded.id;
     req.position = decoded.position;
     next()
    })
 }