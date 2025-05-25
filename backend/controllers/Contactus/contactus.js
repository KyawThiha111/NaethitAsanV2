import ContactusCollection from "../../models/ContactUs/contactus.js";
import { verifyAdmin } from "../../utils/adminverify.js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { isNull } from "util";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "..", "..", ".env") });

export const EditContactData = async (req, res) => {
  const adminid = req.adminid;

  const {
    primary_phone_number,
    secondary_phone_number,
    tertiary_phone_number,
    primary_email,
    secondary_email,
    tertiary_email,
    head_office_1,
    head_office_2,
    head_office_3,
    weekdays_office_hr,
    sat_office_hr,
    sun_office_hr,
  } = req.body;

  try {
    const adminVerified = await verifyAdmin(adminid);
    if (!adminVerified) {
      return res.status(403).json({ success: false, message: "Unauthorized!" });
    }

    const requiredFields = {
      primary_phone_number,
      primary_email,
      head_office_1,
      weekdays_office_hr,
      sat_office_hr,
      sun_office_hr,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields!",
        missingFields,
      });
    }

    const existingContactData = await ContactusCollection.findOne({ admins: adminid });
    if (!existingContactData) {
      return res.status(404).json({
        success: false,
        message: "No contact data found to update!",
      });
    }

    // ✅ Construct update object dynamically
    const toUpdateContactData = {
      primary_phone_number,
      primary_email,
      head_office_1,
      weekdays_office_hr,
      sat_office_hr,
      sun_office_hr,
    };

    if (secondary_phone_number){
        toUpdateContactData.secondary_phone_number = secondary_phone_number;
    }else{
        toUpdateContactData.secondary_phone_number = null;
    }
    if (tertiary_phone_number){
        toUpdateContactData.tertiary_phone_number = tertiary_phone_number;
    }else{
        toUpdateContactData.tertiary_phone_number =  null;
    }
    if (secondary_email){
        toUpdateContactData.secondary_email = secondary_email;
    }else{
        toUpdateContactData.secondary_email = null;
    }
    if (tertiary_email){
        toUpdateContactData.tertiary_email= tertiary_email;
    }else{
        toUpdateContactData.tertiary_email= null;
    }
    if (head_office_2){
        toUpdateContactData.head_office_2 = head_office_2;
    }else{
        toUpdateContactData.head_office_2 = null;
    }
    if (head_office_3){
        toUpdateContactData.head_office_3 = head_office_3
    }else{
        toUpdateContactData.head_office_3 = null
    }

    const updated = await ContactusCollection.findByIdAndUpdate(
      existingContactData._id,
      toUpdateContactData,
      { new: true,runValidators:true}
    );

    if (!updated) {
      return res.status(400).json({
        success: false,
        message: "Failed to update the contact data.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact data updated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === "development" ? error.message : "Internal server error",
    });
  }
};

export const getContactData = async (req, res) => {
    try {
        const contactData = await ContactusCollection.findOne({}).select("-admins -__v");
        
        if (!contactData) {
            return res.status(404).json({
                success: false,
                message: "Contact information not found",
                data: null
            });
        }

        return res.status(200).json({
            success: true,
            message: "Contact data retrieved successfully",
            data: contactData
        });

    } catch (error) {
        console.error("Error fetching contact data:", error);
        
        return res.status(500).json({
            success: false,
            message: process.env.NODE_ENV === "development" 
                ? `Server error: ${error.message}`
                : "Failed to retrieve contact information",
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};
