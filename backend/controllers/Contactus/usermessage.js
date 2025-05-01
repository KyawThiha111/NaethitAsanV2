import UserMessageCollection from "../../models/ContactUs/usermessage.js";
import adminCollection from "../../models/admin.js";
import { verifyAdmin } from "../../utils/adminverify.js";

export const createUserMessage = async (req, res) => {
    try {
        // Get all admin IDs (exactly like in member creation)
        const getalladmins = await adminCollection.find({}, "_id");
        const alladminids = getalladmins.map((admin) => admin._id);

        // Destructure required fields
        const { firstname, lastname, email, phone, subject,message } = req.body;

        /* Required fields validation */
        const requiredFields = { firstname, email, phone, subject,message};
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

        /* Subject enum validation */
        const validSubjects = [
            "General Inquiry",
            "Donation Question",
            "Volunteer Opportunity", // Fixed typo to match your schema
            "Partnership Inquiry"
        ];

        if (!validSubjects.includes(subject)) {
            return res.status(400).json({
                success: false,
                message: "Invalid subject type!",
                validSubjects
            });
        }

        /* Create message - same pattern as member creation */
        const messageToAdd = {
            firstname,
            lastname,
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


