import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path:path.join(__dirname,"../.env")
})

const generateAccessTokenAndSetCookie = (res,id,position)=>{
    const token = jwt.sign({id,position},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    })
    res.cookie("accesstoken",token,{
        httpOnly:true, //protect XSS attack
        secure:process.env.NODE_ENV==="production",//send cookie only over https
        sameSite:"strict",// for csrf attack
        maxAge: 7*24*60*60*1000
    })
    return token
}

export default generateAccessTokenAndSetCookie;