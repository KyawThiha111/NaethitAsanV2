import CataSchema from "../../models/BlogCata/blogcata.js";
import adminCollection from "../../models/admin.js";

export const CreateCata = async (req, res) => {
  try {
    const adminid = req.adminid;
    const { cata_name } = req.body;

    // 1. Input Validation
    if (!cata_name || typeof cata_name !== 'string') {
      return res.status(400).json({  // Changed from 401 to 400 (Bad Request)
        success: false,
        message: "Valid category name is required!"
      });
    }

    // 2. Verify Admin (missing in your original code)
    const adminExists = await adminCollection.findById(adminid);
    if (!adminExists) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access"
      });
    }

    // 3. Get all admin IDs
    const allAdmins = await adminCollection.find({}, "_id");
    const alladminids = allAdmins.map((admin) => admin._id);

    // 4. Check for existing category (case-insensitive)
    const normalizedCataName = cata_name.toLowerCase().trim();
    const existing = await CataSchema.findOne({ 
      cata_name: { 
        $regex: new RegExp(`^${normalizedCataName}$`, 'i') 
      } 
    });

    if (existing) {
      return res.status(409).json({ 
        success: false, 
        message: "Category already exists!" 
      });
    }

    // 5. Create category
    const newCategory = await CataSchema.create({
      cata_name: normalizedCataName,
      admins: alladminids
    });

    if (!newCategory) {
      return res.status(500).json({
        success: false,
        message: "Failed to create category"
      });
    }

    return res.status(201).json({
      success: true,
      message: "Category created successfully!",
      data: newCategory  // Changed from 'cata' to 'data' for consistency
    });

  } catch (error) {
    console.error("Category creation error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const GetAllCata = async (req, res) => {
  try {
    const allCategories = await CataSchema.find().sort({ createdAt: -1 }); // latest first

    return res.status(200).json({
      success: true,
      message: "All categories fetched successfully!",
      data: allCategories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const DeleteCata = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Category ID is required!",
      });
    }

    // Find and delete the category
    const deleted = await CataSchema.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Category not found or already deleted.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully!",
      data: deleted,
    });

  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};



