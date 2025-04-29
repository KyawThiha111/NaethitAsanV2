import AbouUsMissionCollection from "../models/AboutUs/aboutusmission.js";

const addAdminToCollectionWhileSignUp =async(adminId,collection)=>{
    try {
        // Check if any mission documents exist
        //aboutmission,blogcollection,teammember collection
        const missionCount = await collection.countDocuments();
        
        if (missionCount > 0) {
            // Add admin to all existing mission documents if not already present
            await collection.updateMany(
                { admins: { $ne: adminId } },
                { $push: { admins: adminId } }
            );
            return true;
        }
        return false;
    } catch (error) {
        console.error(`Error adding admin to ${collection.collection.name}`, error);
        throw error;
    }
}

export default addAdminToCollectionWhileSignUp;