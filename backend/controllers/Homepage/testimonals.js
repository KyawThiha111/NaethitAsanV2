import TestimonalCollection from "../../models/HomePage/testimonals.js";
import { verifyAdmin } from "../../utils/adminverify.js";
import adminCollection from "../../models/admin.js";
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