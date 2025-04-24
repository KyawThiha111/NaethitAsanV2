import adminCollection from "../models/admin.js";
import AboutUsBannerCollection from "../models/AboutUs/aboutbanner.js";
import bcryptjs from "bcryptjs"
import { verifySignupEmail,welcomeEmail } from "../mailtrap/mail.js";
import generateAccessTokenAndSetCookie from "../utils/geneateTokenAndSetCookie.js";
export const signup = async(req,res)=>{
     const {adminname,email,password,position} = req.body;
     if(!adminname||!email||!password){
        return res.status(400).json({success:false,message:"Fileds required!"})
     }
    try {
        const adminalreadyexist = await adminCollection.findOne({$or:[{adminname},{email}]});
     if(adminalreadyexist){
        return res.status(400).json({success:false,message:"Admin with these fileds already exist!"})
     } 
     const hashedpassword = await bcryptjs.hash(password,10)
     const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
     let signupAdmin;
     if(req.body.position){
         signupAdmin = await adminCollection.create({adminname,email,password:hashedpassword,position,verificationToken,verificationTokenExpiresAt:Date.now()+24*60*60*1000})
     }else{
        signupAdmin = await adminCollection.create({adminname,email,password,verificationToken,verificationTokenExpiresAt:Date.now()+24*60*60*1000})
     }
     await verifySignupEmail(email,verificationToken)
     return res.status(201).json({success:true,message:"Admin signed up!",admin:{...signupAdmin._doc,password:undefined}})
    } catch (error) {
        console.log(error)
     return res.status(500).json({success:false,message:"An error occured while creating a new account!"})
    }

}

export const SignUpVerify = async(req,res)=>{
   const {tokencode} = req.body;
   const dashboardURL = "http://localhost:5173/dashboard";
   try {
      if(!tokencode){
         return res.status(400).json({success:false,message:"Field required!"})
      }
      const adminExisting = await adminCollection.findOne({verificationToken:tokencode,verificationTokenExpiresAt:{$gt:Date.now()}})
      if (!adminExisting) {
			return res.status(404).json({ success: false, message: "Invalid or expired verification code" });
		}
      adminExisting.isVerified=true;
      adminExisting.verificationToken=undefined;
      adminExisting.verificationTokenExpiresAt=undefined;
      await adminExisting.save()
      /* Set cookie and generate token */
      const loginToken = generateAccessTokenAndSetCookie(res,adminExisting._id,adminExisting.position);
      /* Email */
      await welcomeEmail(adminExisting.email,adminExisting.baseModelName,adminExisting.position)
      /* Create default pages data */
     const createdaboutusBanner= await AboutUsBannerCollection.create({admin:adminExisting._id})
      if(!createdaboutusBanner){
         return res.status(400).json({success:false,message:"An error occured while creating default pages!"})
      }
     return res.status(200).json({success:true,message:`Logged in as an ${adminExisting.position}`,loginToken:loginToken})
   } catch (error) {
      return res.status(500).json({success:false,error:error.message})
   }
}