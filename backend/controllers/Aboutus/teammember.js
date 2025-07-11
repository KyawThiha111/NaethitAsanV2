import TeamMemberCollection from "../../models/AboutUs/teammember.js";
import adminCollection from "../../models/admin.js";
import { verifyAdmin } from "../../utils/adminverify.js";
import cleanUpFile from "../../utils/clearFilePath.js";
import path from "path"
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { text } from "stream/consumers";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path:path.join(__dirname,"..","..",".env")
})
const BASE_URL = process.env.BASE_URL;
// adminVerify
// getalladmins
export const create = async(req,res)=>{
    let filePath = null;
    let adminid = req.adminid;
  try {
    const getalladmins = await adminCollection.find({},"_id");
    const alladminids = getalladmins.map((admin)=>admin._id);
    if(req.file){
        filePath = path.basename(req.file.path)
    }
    const {name_en,name_my,position_en,position_my} = req.body;
    /* Check Auth */
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
    /* Member exist */
        const memberExist = await TeamMemberCollection.findOne({
          $or: [{ name_en: name_en }, { name_my: name_my }],
        });
        if (memberExist) {
          const filename = path.basename(filePath);
          const todeletePath = path.join("Aboutus", filename);
         cleanUpFile(todeletePath);// delete the file
          return res.status(409).json({
            // 409 Conflict is more appropriate
            success: false,
            message: "Member with the same name already exists.",
          });
        }
       let membertoAdd = {
        name_en,
        name_my,
        position_en,
        position_my,
        admins:alladminids,
        ...(req.file && {memberphoto:`/public/Aboutus/${req.file.filename}`})
       }
  const addNewMember = await TeamMemberCollection.create(membertoAdd);
  if(!addNewMember){
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
    member: addNewMember,
  });
  } catch (error) {
   if(req.file){
    const filename = path.basename(req.file.path);
    const todeletePath = path.join("Aboutus", filename);
    cleanUpFile(todeletePath);// delete the file
   }
   console.error("Admin creation error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

export const updateTeamMember = async(req,res)=>{
    let newFilePath = null;
    let oldFilePath = null;
    try {
        const {memberid} = req.params;
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
        const existingMember = await TeamMemberCollection.findById(memberid);
        if(!existingMember){
            if(newFilePath){
                const filename = path.basename(newFilePath);
               const todeletePath = path.join("Aboutus", filename);
               cleanUpFile(todeletePath);// delete the file
               }
            return res.status(404).json({success:false,message:"No member exist with the id param!"})
        }
        oldFilePath = path.join(__dirname,"..","..",existingMember.memberphoto)
       /* Another verification */
       if(!existingMember.admins.includes(adminid)){
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
        ...(req.file&&{memberphoto:`/public/Aboutus/${req.file.filename}`}),
        updatedAt:Date.now()
       }

       const updatedMember = await TeamMemberCollection.findByIdAndUpdate(memberid,toupdateMember,{new:true,runValidators:true})
       if(!updatedMember){
        if(newFilePath){
            const filename = path.basename(newFilePath);
           const todeletePath = path.join("Aboutus", filename);
           cleanUpFile(todeletePath);// delete the file
           }
        throw new Error("Failed to update the member!")
       }
       // Clean up old file after successful update
       if(req.file && oldFilePath){
        if(oldFilePath) {
          const filename = path.basename(oldFilePath);
          const todeletePath = path.join("Aboutus", filename);
         cleanUpFile(todeletePath);
        }
       }
           return res.status(200).json({
            success: true,
            message: "Successfully updated the member!",
            blog: updatedMember
          });
    } catch (error) {
         // Clean up new file if error occurred
    if(req.file){
        const filename = path.basename(req.file.path);
        const todeletePath = path.join("Aboutus", filename);
       cleanUpFile(todeletePath);
        }
        console.error("Member update error:", error);
        
        return res.status(500).json({
          success: false,
          message: "Internal server error!",
          error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
}
/* Get all members */
export const GetAllMembers = async (req, res) => {
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
      memberphoto: 1,
      name_en: 1,
      name_my: 1,
      position_en: 1,
      position_my: 1,
      admins: 1,
      createdAt: 1,
      updatedAt: 1,
    };

    const members = await TeamMemberCollection.find({}, projection)
      .sort({ createdAt: -1 }) // Newest first
      .populate("admins", "adminname email position");

    if (!members || members.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No members found",
      });
    }

    const formattedMembers = members.map((member) => {
      const base = {
        id: member._id,
        photo: `${BASE_URL}${member.memberphoto}`,
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

export const GetSingleMember = async (req, res) => {
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
    const member = await TeamMemberCollection.findById(id, {
      memberphoto: 1,
      name_en: 1,
      name_my: 1,
      position_en: 1,
      position_my: 1,
      admins: 1,
      createdAt: 1,
      updatedAt: 1,
    }).populate("admins", "adminname email position");

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    const base = {
      id: member._id,
      photo: `${BASE_URL}${member.memberphoto}`,
      admins: member.admins,
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
    console.error("Get Single Member error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

//Delete Members
export const deleteMember = async (req, res) => {
    try {
        const { memberid } = req.params;
        const adminid = req.adminid;

        /* Check Auth */
        const adminVerified = await verifyAdmin(adminid);
        if (!adminVerified) {
            return res.status(403).json({ 
                success: false, 
                message: "Unauthorized to delete team members! Login first!" 
            });
        }

        /* Check if member exists */
        const existingMember = await TeamMemberCollection.findById(memberid);
        if (!existingMember) {
            return res.status(404).json({ 
                success: false, 
                message: "No member exists with the provided id!" 
            });
        }

        /* Verify admin permissions */
        if (!existingMember.admins.includes(adminid)) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized! You don't have permission to delete this member!",
            });
        }

        /* Store file path for cleanup */
        let filePathToDelete = null;
        if (existingMember.memberphoto) {
            filePathToDelete =  path.join(__dirname, "..", "..", existingMember.memberphoto)
            
        }

        /* Delete member */
        const deletedMember = await TeamMemberCollection.findByIdAndDelete(memberid);
        if (!deletedMember) {
            throw new Error("Failed to delete the member!");
        }

        /* Clean up associated file */
        if (filePathToDelete) {
            const filename = path.basename(filePathToDelete);
            const fullPath = path.join("Aboutus", filename);
            cleanUpFile(fullPath);
        }

        return res.status(200).json({
            success: true,
            message: "Successfully deleted the member!",
            deletedMember
        });

    } catch (error) {
        console.error("Member deletion error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error!",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};