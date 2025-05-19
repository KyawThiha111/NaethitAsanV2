import servicesCollection from "../../models/OurServices/services.js";
import TeamMemberCollection from "../../models/AboutUs/teammember.js";
import UserMessageCollection from "../../models/ContactUs/usermessage.js";
import facilitiesCollection from "../../models/HomePage/facilities.js";
import TestimonalCollection from "../../models/HomePage/testimonals.js";
import BlogCollection from "../../models/blog.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path:path.join(__dirname,"..","..",".env")
})
export const GetPostCount = async(req,res)=>{
    try {
        const countServices = await servicesCollection.countDocuments();
        const countMembers = await TeamMemberCollection.countDocuments();
        const countUserMessage = await UserMessageCollection.countDocuments();
        const countClinics = await facilitiesCollection.countDocuments()
        const countTestimonals = await TestimonalCollection.countDocuments()
        const countBlogs = await BlogCollection.countDocuments();

        const formattedCountData = {
            servicesCount: countServices,
            membersCount: countMembers,
            usermessageCount: countUserMessage,
            clinicCount: countClinics,
            testimonalsCount: countTestimonals,
            blogsCount: countBlogs
        }
        return res.status(200).json({success:true,formattedCountData})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false,message:"Internal server error!",error:process.env.NODE_ENV==="development"?error.message:undefined})
    }
}