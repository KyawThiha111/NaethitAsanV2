import AbouUsMissionCollection from "../../models/AboutUs/aboutusmission.js";
import adminCollection from "../../models/admin.js";
import { verifyAdmin } from "../../utils/adminverify.js";
import dotenv from "dotenv";
import path from "path"
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

dotenv.config({
    path:path.join(__dirname,"..","..",".env")
})
export const create = async(req,res)=>{
try {
    const adminid = req.adminid;
    const adminsIds = await adminCollection.find({},"_id");
    const alladminsids = adminsIds.map((adminid)=>adminid._id)
    const {titleen,titlemy,missionen,missionmy} = req.body;
    const requiredFields = {titleen,titlemy,missionen,missionmy}
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

          /* Check if the same title exist */
          const exisitngmission = await AbouUsMissionCollection.findOne({$or:[{titleen:titleen},{titlemy:titlemy}]})
          if(exisitngmission){
            return res.status(409).json({
                // 409 Conflict is more appropriate
                success: false,
                message: "Mission with this title already exists.",
              });
          }
             //verify admin
      const adminverified = await verifyAdmin(adminid)
      if(!adminverified){
        return res.status(403).json({
            success: false,
            message: "Unauthorized - Invalid admin credentials"
        });
      }
          const createdMission = await AbouUsMissionCollection.create({...req.body,admins:alladminsids})
          if(!createdMission){
            return res.status(500).json({success:false,message:"Error while creating mission!"})
          }
          return res.status(201).json({success:true,message:"Successfully created a mission card!"})
} catch (error) {
    console.error(error)
    return res.status(500).json({success:true,message:"Error while creating a mission",error:process.env.NODE_ENV==="development"?error.message:undefined})
}
}

export const getAllMissions = async (req, res) => {
    try {
      const { lang } = req.query;
  
      if (lang && !['en', 'my'].includes(lang)) {
        return res.status(400).json({
          success: false,
          message: "Invalid language. Use 'en' or 'my'",
        });
      }
  
      const missions = await AbouUsMissionCollection.find()
        .populate('admins', 'adminname position')
        .lean();
  
      const formattedMissions = missions.map((mission) => {
        if (lang === 'en') {
          return {
            _id: mission._id,
            title: mission.titleen,
            mission: mission.missionen,
            createdAt: mission.createdAt,
            admins: mission.admins,
          };
        } else if (lang === 'my') {
          return {
            _id: mission._id,
            title: mission.titlemy,
            mission: mission.missionmy,
            createdAt: mission.createdAt,
            admins: mission.admins,
          };
        } else {
          // Return both languages
          return {
            _id: mission._id,
            title: {
              en: mission.titleen,
              my: mission.titlemy,
            },
            mission: {
              en: mission.missionen,
              my: mission.missionmy,
            },
            createdAt: mission.createdAt,
            admins: mission.admins,
          };
        }
      });
  
      return res.status(200).json({
        success: true,
        data: formattedMissions,
      });
    } catch (error) {
      console.error("Get missions error:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching missions",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  };
/* Get Each Mission */
export const getEachMission = async (req, res) => {
    try {
      const { id } = req.params;
      const { lang } = req.query;
  
      if (lang && !['en', 'my'].includes(lang)) {
        return res.status(400).json({
          success: false,
          message: "Invalid language. Use 'en' or 'my'",
        });
      }
  
      const mission = await AbouUsMissionCollection.findById(id)
        .populate('admins', 'adminname position')
        .lean();
  
      if (!mission) {
        return res.status(404).json({
          success: false,
          message: 'Mission not found',
        });
      }
  
      let formattedMission;
  
      if (lang === 'en') {
        formattedMission = {
          _id: mission._id,
          title: mission.titleen,
          mission: mission.missionen,
          createdAt: mission.createdAt,
          admins: mission.admins,
        };
      } else if (lang === 'my') {
        formattedMission = {
          _id: mission._id,
          title: mission.titlemy,
          mission: mission.missionmy,
          createdAt: mission.createdAt,
          admins: mission.admins,
        };
      } else {
        formattedMission = {
          _id: mission._id,
          title: {
            en: mission.titleen,
            my: mission.titlemy,
          },
          mission: {
            en: mission.missionen,
            my: mission.missionmy,
          },
          createdAt: mission.createdAt,
          admins: mission.admins,
        };
      }
  
      return res.status(200).json({
        success: true,
        data: formattedMission,
      });
    } catch (error) {
      console.error("Get mission error:", error);
      return res.status(500).json({
        success: false,
        message: "Error fetching mission",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  };
  
/* Update */
export const updateMission = async (req, res) => {
    try {
        const adminid = req.adminid;
        const { id } = req.params;
        const { titleen, titlemy, missionen, missionmy } = req.body;

        // Validate required fields
        const requiredFields = { titleen, titlemy, missionen, missionmy };
        const missingFields = Object.entries(requiredFields)
            .filter(([_, value]) => !value)
            .map(([key]) => key);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Fields required!",
                missingFields
            });
        }

        // Check if mission exists
        const existingMission = await AbouUsMissionCollection.findById(id);
        if (!existingMission) {
            return res.status(404).json({
                success: false,
                message: "Mission not found"
            });
        }
      //verify admin
      const adminverified = await verifyAdmin(adminid)
      if(!adminverified){
        return res.status(403).json({
            success: false,
            message: "Unauthorized - Invalid admin credentials"
        });
      }
        // Check for duplicate titles (excluding current document)
        const titleExists = await AbouUsMissionCollection.findOne({
            _id: { $ne: id },
            $or: [{ titleen }, { titlemy }]
        });

        if (titleExists) {
            return res.status(409).json({
                success: false,
                message: "Mission with this title already exists"
            });
        }

        // Prepare update data
        const updateData = {
            titleen,
            titlemy,
            missionen,
            missionmy
        };

        // Add admin to admins array if not already present
        if (!existingMission.admins.includes(adminid)) {
            updateData.$addToSet = { admins: adminid };
        }

        // Update the mission
        const updatedMission = await AbouUsMissionCollection.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedMission) {
            throw new Error("Failed to update mission");
        }

        return res.status(200).json({
            success: true,
            message: "Mission updated successfully",
            mission: updatedMission
        });

    } catch (error) {
        console.error("Update mission error:", error);
        return res.status(500).json({
            success: false,
            message: "Error updating mission",
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};

/* DELETE */
export const deleteMission = async (req, res) => {
    try {
        const { id } = req.params;
        const adminid = req.adminid;
        // Check if mission exists
        const mission = await AbouUsMissionCollection.findById(id);
        if (!mission) {
            return res.status(404).json({
                success: false,
                message: "Mission not found"
            });
        }
         //verify admin
      const adminverified = await verifyAdmin(adminid)
      if(!adminverified){
        return res.status(403).json({
            success: false,
            message: "Unauthorized - Invalid admin credentials"
        });
      }
        // Delete the mission
        const deletedMission = await AbouUsMissionCollection.findByIdAndDelete(id);
        if (!deletedMission) {
            throw new Error("Failed to delete mission");
        }

        return res.status(200).json({
            success: true,
            message: "Mission deleted successfully"
        });

    } catch (error) {
        console.error("Delete mission error:", error);
        return res.status(500).json({
            success: false,
            message: "Error deleting mission",
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};