import TestimonalCollection from "../../models/HomePage/testimonals.js";
import { verifyAdmin } from "../../utils/adminverify.js";
import adminCollection from "../../models/admin.js";
import dotenv from "dotenv";
import path from "path"
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

dotenv.config({
    path:path.join(__dirname,"..","..",".env")
})

export const createTestimonal = async(req,res)=>{
    const adminid = req.adminid;
    const getalladmins = await adminCollection.find({},"_id");
    const alladminids = getalladmins.map((admin)=> admin._id);
    try {
        //Verify the admin
        const adminVerifed = await verifyAdmin(adminid);
        if(!adminVerifed){
            return res.status(403).json({success:false,message:"Unauthorized! Log in first!"})
        }

        /* Check input fields */
        const {note_en,note_my,patient_name_en,patient_name_my,patient_type_en,patient_type_my} = req.body;
        const requiredFields = {note_en,note_my,patient_name_en,patient_name_my,patient_type_en,patient_type_my};

        const missingFields = Object.entries(requiredFields)
        .filter(([_,value])=> !value)
        .map(([key])=> key)

        if(missingFields.length>0){
            return res.status(400).json({success:false,message:"Fields required!", missingFields})
        }

        const toUploadTestimonal = {
            note_en,
            note_my,
            patient_name_en,
            patient_name_my,
            patient_type_en,
            patient_type_my,
            admins:alladminids
        }

        const createdTestimonals = await TestimonalCollection.create(toUploadTestimonal);
        if(!createdTestimonals){
            return res.status(400).json({success:false,message:"An error occured while creating the testimonal! Pls check the code!"})
        }

        return res.status(201).json({success:true,mesage:"A new testimonal has been added!",createdTestimonals})
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({success:false, error: process.env.NODE_ENV==="development"? error.mesage:undefined})
    }
}

export const GetAllTestimonal = async(req,res)=>{
    const {lang} = req.query;
    let projection = {};
    try {
        if(lang==="en" || lang==="my"){
          projection[`note_${lang}`] = 1;
          projection[`patient_name_${lang}`] = 1;
          projection[`patient_type_${lang}`] = 1
        }else if(lang===undefined){
            projection["note_en"] = 1;
            projection["note_my"] = 1;
            projection["patient_name_en"] = 1;
            projection["patient_name_my"] = 1;
            projection["patient_type_en"] = 1;
            projection["patient_type_my"] = 1;
        }
         
        const Testimonals = await TestimonalCollection.find({},projection)
        .sort({createdAt: -1})
        .lean() //will trun the resposne to object

        const FormattedResponse = Testimonals.map((testimonal)=>{
            const testimonalObj = testimonal;
            if(lang==="en" || lang==="my"){
               return {
                note: testimonalObj[`note_${lang}`],
                patient_name: testimonalObj[`patient_name_${lang}`],
                patient_type: testimonalObj[`patient_type_${lang}`],
                id: testimonalObj._id
               }
            }else{
                return testimonalObj
            }
        })
        return res.status(200).json({
            success:true,
            FormattedResponse
        })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
        success:false,
        message:"An unknown error occured in the backend for this get route.",
        error: process.env.NODE_ENV==="developement"?error.message:undefined 
        })
    }
}

export const DeleteTestimonal = async(req,res)=>{
    const {id} = req.params;
    const adminid = req.adminid;
    try {
        const isAdminVerified = await verifyAdmin(adminid);
        if(!isAdminVerified){
            return res.status(403).json({success:false,message:"Unauthorized to delete!"})
        }

        /* Find with the id */
        const foundTestimonal = await TestimonalCollection.findById(id);
        if(!foundTestimonal){
            return res.status(404).json({
                success:false,
                message:"No testimonals found to delete!"
            })
        }

        const deleteTestimonal = await TestimonalCollection.findByIdAndDelete(id);
        if(!deleteTestimonal){
            return res.status(400).json({success:false,message:"Error occured while deleting the item!"})
        }
        return res.status(200).json({success:true,message:`Successfully deleted the note by the patient ${deleteTestimonal.patient_name_en}`})
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            success:false,
            message:"An unknown error occured in the backend for this delete route.",
            error: process.env.NODE_ENV==="developement"?error.message:undefined 
            })
    }
}