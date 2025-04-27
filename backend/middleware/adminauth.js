/* import jwt from "jsonwebtoken";
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
 } */
    import jwt from "jsonwebtoken";
    import dotenv from "dotenv";
    import path from "path";
    import { fileURLToPath } from "url";
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    dotenv.config({ path: path.join(__dirname, "../.env") });
    
    export const checkAuthMiddleware = async (req, res, next) => {
        try {
            // 1. Check Authorization Header
            const authHeader = req.headers.authorization;
            if (!authHeader?.startsWith("Bearer ")) {
                return res.status(401).json({ 
                    success: false, 
                    message: "Unauthorized - No token provided" 
                });
            }
    
            // 2. Extract Token
            const token = authHeader.split(" ")[1];
            if (!token) {
                return res.status(401).json({ 
                    success: false, 
                    message: "Unauthorized - Malformed token" 
                });
            }
    
            // 3. Verify Token
            const decoded = await new Promise((resolve, reject) => {
                jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                    if (err) reject(err);
                    else resolve(decoded);
                });
            });
    
            req.adminid = decoded.id;
            req.position = decoded.position;
    
            next();
        } catch (error) {
            console.error("Authentication error:", error);
    
            // Specific error messages
            let message = "Authentication failed";
            if (error.name === "TokenExpiredError") {
                message = "Session expired - Please login again";
            } else if (error.name === "JsonWebTokenError") {
                message = "Invalid token";
            }
    
            return res.status(403).json({ 
                success: false, 
                message 
            });
        }
    };