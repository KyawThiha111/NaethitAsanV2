import UserMessageCollection from "../../models/ContactUs/usermessage.js";
import adminCollection from "../../models/admin.js";
import { verifyAdmin } from "../../utils/adminverify.js";
import notiCollection from "../../models/NOTI/messagenoti.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path:path.join(__dirname,"..","..",".env")
})
export const createUserMessage = async (req, res) => {
    try {
        // Get all admin IDs (exactly like in member creation)
        const getalladmins = await adminCollection.find({}, "_id");
        const alladminids = getalladmins.map((admin) => admin._id);

        // Destructure required fields
        const { sendername, email, phone, subject,message } = req.body;

        /* Required fields validation */
        const requiredFields = { sendername,email,phone, subject,message};
        const missingFields = Object.entries(requiredFields)
            .filter(([_, value]) => !value)
            .map(([key]) => key);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Fields required!",
                missingFields,
            });
        }
      /*   const validSubjects = [
            "General Inquiry",
            "Donation Question",
            "Volunteer Opportunity", // Fixed typo to match your schema
            "Partnership Inquiry"
        ];
 */
       /*  if (!validSubjects.includes(subject)) {
            return res.status(400).json({
                success: false,
                message: "Invalid subject type!",
                validSubjects
            });
        } */

        /* Create message - same pattern as member creation */
        const messageToAdd = {
            sendername,
            email,
            phone,
            subject,
            message,
            admins: alladminids // Assign to all admins like members
        };

        const newMessage = await UserMessageCollection.create(messageToAdd);

        if (!newMessage) {
            throw new Error("Failed to create message in database");
        }
        
        const exisitngNotiCollection = await notiCollection.findOne({});
        if(!exisitngNotiCollection){
            const toCreateCount = {
                count: 0,
                admins:alladminids
            }
            const createCount = await notiCollection.create(toCreateCount);
            if(!createCount){
                return res.status(400).json({success:false,message:"Error while sending the noti to the admin!"})
            }
        }else{
            exisitngNotiCollection.count += 1;
            exisitngNotiCollection.save()
        }
        return res.status(201).json({
            success: true,
            message: "Message successfully sent to the admin!",
            userMessage: newMessage
        });

    } catch (error) {
        console.error("Message creation error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};

export const getUserMessage = async(req,res)=>{
    const adminid = req.adminid;
    const adminVerified = await verifyAdmin(adminid);
    try {
        if(!adminVerified){
            return res.status(403).json({success:false, message:"Unauthorized!"})
        }

        const userMessages = await UserMessageCollection.find({}).select("-admins")
        if(!userMessages){
            return res.status(404).json({success:false, message:"An error or no messages!"})
        }
        return res.status(200).json({success:true,message:"Fetched get messages!",messages:userMessages})
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,error:process.env.NODE_ENV==="development"?error.message:undefined})
    }
}

export const deleteUserMessage = async(req,res)=>{
    const adminid = req.adminid;
    const {postid} = req.params;

    try {
        const adminVerified = await verifyAdmin(adminid);
        if(!adminVerified){
            return res.status(403).json({success:false, message:"Unauthorized to delete the message!"})
        }

        const exisitngMessage = await UserMessageCollection.findById(postid);
        if(!exisitngMessage){
            return res.status(404).json({success:false,message:"No message with the id exisitng!"})
        }

        const deleteMessage = await UserMessageCollection.findByIdAndDelete(postid);
        if(!deleteMessage){
            return res.status(400).json({success:false,message:"An error while deleting the message!"})
        }

        return res.status(200).json({success:true,message:`Successfully Deleted the message of sender ${exisitngMessage.sendername}`})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success:false,error:process.env.NODE_ENV==="development"?error.message:undefined})
    }
}


