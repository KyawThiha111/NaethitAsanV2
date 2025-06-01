import LeaderCollection from "../../models/AboutUs/leaders.js";
import { verifyAdmin } from "../../utils/adminverify.js";
import cleanUpFile from "../../utils/clearFilePath.js";
import path from "path";
import {fileURLToPath} from "url";
import dotenv from "dotenv"
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import adminCollection from "../../models/admin.js";

dotenv.config({
    path:path.join(__dirname,"..","..",".env")
})
const BASE_URL = process.env.BASE_URL;
export const CreateLeader = async(req,res)=>{
    let filePath = null;
    let adminid = req.adminid;
    try {
        if(req.file){
            filePath = path.basename(req.file.path)
        }
        const getalladmins = await adminCollection.find({},"_id");
        const alladminids = getalladmins.map((admin)=>admin._id)

        const {photo,name_en,name_my,position_en,position_my} = req.body;
        const adminVerified = await verifyAdmin(adminid)
    if(!adminVerified){
        if(filePath){
            const filename = path.basename(filePath);
           const todeletePath = path.join("Aboutus", filename);
           cleanUpFile(todeletePath);// delete the file
           }
        return res.status(403).json({success:false,message:"Unauthorized to add a team member! Login first!"})
    }

    const requiredFields = {name_en,name_my,position_en,position_my};
      const missingFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value)
        .map(([key]) => key);
       //Missing Fields
        if(missingFields.length>0){
            if(filePath){
             const filename = path.basename(filePath);
            const todeletePath = path.join("Aboutus", filename);
            cleanUpFile(todeletePath);// delete the file
            }
            return res.status(400).json({
                success: false,
                message: "Fields required!",
                missingFields,
              });
        }
    
        const leaderExist = await LeaderCollection.findOne({
            $or:[{name_en:name_en},{name_my:name_my}]
        })
        if(leaderExist){
            if(filePath){
                const filename = path.basename(filePath);
                const todeletePath = path.join("Aboutus", filename);
                cleanUpFile(todeletePath);// delete the file
            }
            return res.status(400).json({
                success: false,
                message: "The leader with this name already exists!",
                missingFields,
              });
        }

        const leaderToAdd = {
            name_en:name_en,
            name_my:name_my,
            position_en:position_en,
            position_my:position_my,
            admins:alladminids,
            ...(req.file&& {photo:`/public/Aboutus/${req.file.filename}`})
        }

        const newLeader = await LeaderCollection.create(leaderToAdd)
        if(!newLeader){
           if(req.file){
               const filename = path.basename(filePath);
               const todeletePath = path.join("Aboutus", filename);
               cleanUpFile(todeletePath);// delete the file
           }
           return res.status(500).json({success:false,message:"Error while creating a new member!"})
         }
         return res.status(201).json({
           success: true,
           message: "Successfully added a new member!",
           member: newLeader,
         });
    } catch (error) {
       if(req.file){
          const filename = path.basename(req.file.path);
          const todeletePath = path.join("Aboutus", filename);
          cleanUpFile(todeletePath);// delete the file
         }
         console.error("Leader creation error:", error);
          return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
          });
    }
}


export const updateLeader = async(req,res)=>{
    let newFilePath = null;
    let oldFilePath = null;
    try {
        const {leaderid} = req.params;
        const adminid = req.adminid;
        if(req.file){
            newFilePath = path.basename(req.file.path)
        }
        const {name_en,name_my,position_en,position_my} = req.body;
        /* Check Auth */
        const adminVerified = await verifyAdmin(adminid)
        if(!adminVerified){
            if(newFilePath){
                const filename = path.basename(newFilePath);
               const todeletePath = path.join("Aboutus", filename);
               cleanUpFile(todeletePath);// delete the file
               }
            return res.status(403).json({success:false,message:"Unauthorized to update a team member! Login first!"})
        }
        const requiredFields = {name_en,name_my,position_en,position_my};
        const missingFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value)
        .map(([key]) => key);
       //Missing Fields
        if(missingFields.length>0){
            if(newFilePath){
             const filename = path.basename(newFilePath);
            const todeletePath = path.join("Aboutus", filename);
            cleanUpFile(todeletePath);// delete the file
            }
            return res.status(400).json({
                success: false,
                message: "Fields required!",
                missingFields,
              });
        }

        /* Store old file path if it exists */
        const existingLeader = await LeaderCollection.findById(leaderid);
        if(!existingLeader){
            if(newFilePath){
                const filename = path.basename(newFilePath);
               const todeletePath = path.join("Aboutus", filename);
               cleanUpFile(todeletePath);// delete the file
               }
            return res.status(404).json({success:false,message:"No leader exist with the id param!"})
        }
        oldFilePath = path.join(__dirname,"..","..",existingLeader.photo)
       /* Another verification */
       if(!existingLeader.admins.includes(adminid)){
        if(newFilePath){
            const filename = path.basename(newFilePath);
           const todeletePath = path.join("Aboutus", filename);
           cleanUpFile(todeletePath);// delete the file
           }
           return res.status(403).json({
            success: false,
            message: "Unauthorized! You don't have permission to update this blog!",
          });
       }

       const toupdateMember = {
        name_en,
        name_my,
        position_en,
        position_my,
        ...(req.file&&{photo:`/public/Aboutus/${req.file.filename}`}),
        updatedAt:Date.now()
       }

       const updatedLeader = await LeaderCollection.findByIdAndUpdate(leaderid,toupdateMember,{new:true,runValidators:true})
       if(!updatedLeader){
        if(newFilePath){
            const filename = path.basename(newFilePath);
           const todeletePath = path.join("Aboutus", filename);
           cleanUpFile(todeletePath);// delete the file
           }
        throw new Error("Failed to update the member!")
       }
       // Clean up old file after successful update
           if (oldFilePath) {
             const filename = path.basename(oldFilePath);
             const todeletePath = path.join("Aboutus", filename);
            cleanUpFile(todeletePath);
           }
           return res.status(200).json({
            success: true,
            message: "Successfully updated the member!",
            blog: updatedLeader
          });
    } catch (error) {
    if(req.file){
        const filename = path.basename(req.file.path);
        const todeletePath = path.join("Aboutus", filename);
       cleanUpFile(todeletePath);
        }
        console.error("Leader update error:", error);
        
        return res.status(500).json({
          success: false,
          message: "Internal server error!",
          error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
}

/* Get all */
export const GetAllLeaders = async (req, res) => {
  try {
    const { lang } = req.query;

    // Validate if lang is provided and invalid
    if (lang && lang !== "en" && lang !== "my") {
      return res.status(400).json({
        success: false,
        message: "Invalid language. Use lang=en or lang=my",
      });
    }

    // Always get all language fields so we can format dynamically
    const projection = {
      photo: 1,
      name_en: 1,
      name_my: 1,
      position_en: 1,
      position_my: 1,
      admins: 1,
      createdAt: 1,
      updatedAt: 1,
    };

    const members = await LeaderCollection.find({}, projection)
      .sort({ createdAt: -1 }) // Newest first

    if (!members || members.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No Leaders found",
      });
    }

    const formattedMembers = members.map((member) => {
      const base = {
        id: member._id,
        photo: `${member.photo}`,
        admins: member.admins,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
      };

      // Return according to lang query
      if (lang === "en") {
        return {
          ...base,
          name: member.name_en,
          position: member.position_en,
        };
      } else if (lang === "my") {
        return {
          ...base,
          name: member.name_my,
          position: member.position_my,
        };
      } else {
        // Return both
        return {
          ...base,
          name: {
            en: member.name_en,
            my: member.name_my,
          },
          position: {
            en: member.position_en,
            my: member.position_my,
          },
        };
      }
    });

    return res.status(200).json({
      success: true,
      count: formattedMembers.length,
      members: formattedMembers,
    });

  } catch (error) {
    console.error("Get Members error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/* Get single leaders */
export const GetSingleLeader = async (req, res) => {
  try {
    const { id } = req.params;
    const { lang } = req.query;

    // Validate language query
    if (lang && lang !== "en" && lang !== "my") {
      return res.status(400).json({
        success: false,
        message: "Invalid language. Use lang=en or lang=my",
      });
    }

    // Always fetch all language fields
    const member = await LeaderCollection.findById(id, {
      photo: 1,
      name_en: 1,
      name_my: 1,
      position_en: 1,
      position_my: 1,
      admins: 1,
      createdAt: 1,
      updatedAt: 1,
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Leaders not found",
      });
    }

    const base = {
      id: member._id,
      photo: `${BASE_URL}${member.photo}`,
      createdAt: member.createdAt,
      updatedAt: member.updatedAt,
    };

    // Format based on lang query
    let formattedMember;
    if (lang === "en") {
      formattedMember = {
        ...base,
        name: member.name_en,
        position: member.position_en,
      };
    } else if (lang === "my") {
      formattedMember = {
        ...base,
        name: member.name_my,
        position: member.position_my,
      };
    } else {
      // Return both languages
      formattedMember = {
        ...base,
        name: {
          en: member.name_en,
          my: member.name_my,
        },
        position: {
          en: member.position_en,
          my: member.position_my,
        },
      };
    }

    return res.status(200).json({
      success: true,
      member: formattedMember,
    });

  } catch (error) {
    console.error("Get Single Leader error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

//Delete Members
export const deleteLeader = async (req, res) => {
    try {
        const { memberid } = req.params;
        const adminid = req.adminid;

        /* Check Auth */
        const adminVerified = await verifyAdmin(adminid);
        if (!adminVerified) {
            return res.status(403).json({ 
                success: false, 
                message: "Unauthorized to delete leader! Login first!" 
            });
        }

        /* Check if member exists */
        const existingMember = await LeaderCollection.findById(memberid);
        if (!existingMember) {
            return res.status(404).json({ 
                success: false, 
                message: "No leader exists with the provided id!" 
            });
        }

        /* Verify admin permissions */
        if (!existingMember.admins.includes(adminid)) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized! You don't have permission to delete this leader!",
            });
        }

        /* Store file path for cleanup */
        let filePathToDelete = null;
        if (existingMember.photo) {
            filePathToDelete =  path.join(__dirname, "..", "..", existingMember.photo)   
        }

        /* Delete member */
        const deletedMember = await LeaderCollection.findByIdAndDelete(memberid);
        if (!deletedMember) {
            throw new Error("Failed to delete the leader!");
        }

        /* Clean up associated file */
        if (filePathToDelete) {
            const filename = path.basename(filePathToDelete);
            const fullPath = path.join("Aboutus", filename);
            cleanUpFile(fullPath);
        }

        return res.status(200).json({
            success: true,
            message: "Successfully deleted the leader!",
            deletedMember
        });

    } catch (error) {
        console.error("Leader deletion error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error!",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};
