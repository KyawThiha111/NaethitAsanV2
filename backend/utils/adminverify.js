import adminCollection from "../models/admin.js";
// Haven't used 
export const verifyAdmin = async (adminId) => {
    try {
        const admin = await adminCollection.findById(adminId);
        return !!admin; // Returns true if admin exists, false otherwise
    } catch (error) {
        console.error("Admin verification error:", error);
        return false;
    }
};