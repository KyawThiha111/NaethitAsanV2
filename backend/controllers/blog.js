import BlogCollection from "../models/blog.js";
import cleanUpFile from "../utils/clearFilePath.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import adminCollection from "../models/admin.js";
import { verifyAdmin } from "../utils/adminverify.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "..", ".env"),
});

const BASE_URL = process.env.BASE_URL;
//Create, Update, GetAll, Delete

export const CreateBlog = async (req, res) => {
  let filePath = null;
  try {
    const adminid = req.adminid;
    const getalladmins = await adminCollection.find({},"_id");
    const alladminids = getalladmins.map((admin)=>admin._id);
    const {
      titleen,
      titlemy,
      descriptionen,
      descriptionmy,
      blogen,
      blogmy,
      postdate,
      timelength,
      catagory,
    } = req.body;

    // Validate required fields
    const requiredFields = {
      titleen,
      titlemy,
      descriptionen,
      descriptionmy,
      blogen,
      blogmy,
      postdate,
      timelength,
      catagory,
    };
       // Set file path if file exists
       //we will use it in the clear function
       if (req.file) {
        filePath = path.join(__dirname, "..", "public", "Blog", req.file.filename);
      }
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      cleanUpFile(filePath)// delete the file
      return res.status(400).json({
        success: false,
        message: "Fields required!",
        missingFields,
      });
    }

    // Check for existing blog
    const blogExist = await BlogCollection.findOne({
      $or: [{ titleen: titleen }, { titlemy: titlemy }],
    });
    if (blogExist) {
      cleanUpFile(filePath)
      return res.status(409).json({
        // 409 Conflict is more appropriate
        success: false,
        message: "Post with this title already exists.",
      });
    }

    const toUploadBlog = {
      titleen,
      titlemy,
      descriptionen,
      descriptionmy,
      blogen,
      blogmy,
      postdate,
      timelength,
      catagory,
      admins: alladminids,
      ...(req.file && { img: `/public/Blog/${req.file.filename}` }),
    };
          //verify admin
          const adminverified = await verifyAdmin(adminid)
          if(!adminverified){
           cleanUpFile(filePath)
            return res.status(403).json({
                success: false,
                message: "Unauthorized - Invalid admin credentials"
            });
          }
    // Create new blog
    const createdBlog = await BlogCollection.create(toUploadBlog);

    if (!createdBlog) {
      cleanUpFile(filePath)
      return res.status(500).json({
        success: false,
        message: "Error while creating a blog!",
      });
    }
    return res.status(201).json({
      success: true,
      message: "Successfully added a blog!",
      blog: createdBlog,
    });
  } catch (error) {
    if (req.file) {
     cleanUpFile(filePath)
    }
    console.error("Blog creation error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const UpdateBlogPost = async (req, res) => {
  let newFilePath = null;
  let oldFilePath = null;
  
  try {
    const { blogid } = req.params;
    const adminid = req.adminid;
    const {
      titleen,
      titlemy,
      descriptionen,
      descriptionmy,
      blogen,
      blogmy,
      postdate,
      timelength,
      catagory,
    } = req.body;

    // Set file paths for cleanup
    if (req.file) {
      newFilePath = req.file.path;
      // Store old file path if it exists
      const existingBlog = await BlogCollection.findById(blogid);
      if (existingBlog?.img) {
        oldFilePath = path.join(__dirname, "..", existingBlog.img);
      }
    }

    // Validate required fields
    const requiredFields = {
      titleen,
      titlemy,
      descriptionen,
      descriptionmy,
      blogen,
      blogmy,
      postdate,
      timelength,
      catagory,
    };
    
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      cleanUpFile(newFilePath);
      return res.status(400).json({ 
        success: false, 
        message: "Fields required!", 
        missingFields 
      });
    }

    // Verify admin first
    const adminverified = await verifyAdmin(adminid);
    if (!adminverified) {
      cleanUpFile(newFilePath);
      return res.status(403).json({
        success: false,
        message: "Unauthorized - Invalid admin credentials"
      });
    }

    // Check if blog exists and admin has permission
    const existingBlog = await BlogCollection.findById(blogid);
    if (!existingBlog) {
      cleanUpFile(newFilePath);
      return res.status(404).json({ 
        success: false, 
        message: "Blog not found!" 
      });
    }

    // Check if admin is in the admins array
    if (!existingBlog.admins.includes(adminid)) {
      cleanUpFile(newFilePath);
      return res.status(403).json({
        success: false,
        message: "Unauthorized! You don't have permission to update this blog!",
      });
    }

    // Validate image if provided
    if (req.file) {
      const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp"
      ];
      const ext = path.extname(req.file.originalname).toLowerCase();

      if (!allowedMimeTypes.includes(req.file.mimetype) && ext !== ".jfif") {
        cleanUpFile(newFilePath);
        return res.status(400).json({ 
          success: false, 
          message: "Invalid image format!" 
        });
      }
    }

    // Prepare update data
    const updateData = {
      titleen,
      titlemy,
      descriptionen,
      descriptionmy,
      blogen,
      blogmy,
      postdate,
      timelength,
      catagory,
      ...(req.file && { img: `/public/Blog/${req.file.filename}` }),
      updatedAt: Date.now() // Explicit update timestamp
    };

    // Add admin to admins array if not already present (optional)
    if (!existingBlog.admins.includes(adminid)) {
      updateData.$addToSet = { admins: adminid };
    }

    // Update the blog
    const updatedBlog = await BlogCollection.findByIdAndUpdate(
      blogid,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      cleanUpFile(newFilePath);
      throw new Error("Failed to update blog");
    }

    // Clean up old file after successful update
    if (oldFilePath) {
      cleanUpFile(oldFilePath);
    }

    return res.status(200).json({
      success: true,
      message: "Successfully updated the blog!",
      blog: updatedBlog
    });

  } catch (error) {
    // Clean up new file if error occurred
    cleanUpFile(newFilePath);
    console.error("Blog update error:", error);
    
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

//getallblog
export const GetAllBlog = async (req, res) => {
  try {
    const { lang = "en" } = req.query; // Default to English if not specified

    // Validate language parameter
    if (lang !== "en" && lang !== "my") {
      return res.status(400).json({
        success: false,
        message: "Invalid language. Use lang=en or lang=my",
      });
    }

    // Determine which fields to select based on language
    const projection = {
      [`title${lang}`]: 1,
      [`description${lang}`]: 1,
      [`blog${lang}`]: 1,
      postdate: 1,
      timelength: 1,
      catagory: 1,
      img: 1,
      admins: 1,
      createdAt: 1,
      updatedAt: 1,
    };

    // Get all blogs with the specified language fields
    const blogs = await BlogCollection.find({}, projection)
      .sort({ postdate: -1 }) // Sort by newest first
      .populate("admins", "adminname email position"); // Populate admin info

    if (!blogs || blogs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No blogs found",
      });
    }

    // Format the response
    const formattedBlogs = blogs.map((blog) => {
      const formatted = {
        id: blog._id,
        title: blog[`title${lang}`],
        description: blog[`description${lang}`],
        content: blog[`blog${lang}`],
        postdate: blog.postdate,
        timelength: blog.timelength,
        category: blog.catagory,
        image: `${BASE_URL}${blog.img}`,
        admins: blog.admins, // Include the admins array
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt
      };
      return formatted;
    });

    return res.status(200).json({
      success: true,
      count: formattedBlogs.length,
      blogs: formattedBlogs,
    });

  } catch (error) {
    console.error("Get blogs error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/* Get based on cata */
export const GetBlogsByCategory = async (req, res) => {
  try {
    const { lang = 'en', catagory = 'All', page = 1, limit = 10 } = req.query;

    // Validate language
    if (!['en', 'my'].includes(lang)) {
      return res.status(400).json({
        success: false,
        message: "Invalid language parameter. Use 'en' or 'my'"
      });
    }

    // Validate category
    const validCategories = ["All", "Community", "Volunteers", "Research", "Partnerships"];
    if (!validCategories.includes(catagory)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category",
        validCategories
      });
    }

    // Build query filter
    const filter = {};
    if (catagory !== 'All') {
      filter.catagory = catagory;
    }

    // Set up projection based on language
    const projection = {
      [`title${lang}`]: 1,
      [`description${lang}`]: 1,
      [`blog${lang}`]: 1,
      catagory: 1,
      img: 1,
      postdate: 1,
      timelength: 1,
      admins: 1,
      createdAt: 1
    };

    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const total = await BlogCollection.countDocuments(filter);

    // Get paginated results
    const blogs = await BlogCollection.find(filter, projection)
      .sort({ postdate: -1 })
      .skip(startIndex)
      .limit(parseInt(limit))
      .populate('admins', 'adminname email');

    if (!blogs || blogs.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No blogs found in ${catagory} category`
      });
    }

    // Format response
    const formattedBlogs = blogs.map(blog => ({
      id: blog._id,
      title: blog[`title${lang}`],
      description: blog[`description${lang}`],
      content: blog[`blog${lang}`],
      category: blog.catagory,
      image: `${BASE_URL}${blog.img}`,
      postDate: blog.postdate,
      timeLength: blog.timelength,
      authors: blog.admins,
      createdAt: blog.createdAt
    }));

    return res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      category: catagory,
      blogs: formattedBlogs
    });

  } catch (error) {
    console.error('Get blogs by category error:', error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const DeleteBlog = async (req, res) => {
  try {
    const { blogid } = req.params;
    const adminid = req.adminid;

    // Verify admin exists
    const adminExists = await adminCollection.findById(adminid);
    if (!adminExists) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized - Invalid admin credentials"
      });
    }

    // Find the blog to get image path and verify ownership
    const blogToDelete = await BlogCollection.findById(blogid);
    if (!blogToDelete) {
      return res.status(404).json({
        success: false,
        message: "Blog not found"
      });
    }

    // Check if admin is in the admins array
    if (!blogToDelete.admins.includes(adminid)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized - You can only delete your own blogs"
      });
    }

    // Delete the blog
    const deletedBlog = await BlogCollection.findByIdAndDelete(blogid);
    if (!deletedBlog) {
      throw new Error("Failed to delete the blog!");
    }

    // Clean up associated image file if it exists
    if (blogToDelete.img) {
      const imagePath = path.join(__dirname, '..', blogToDelete.img);
      cleanUpFile(imagePath);
    }

    return res.status(200).json({ 
      success: true, 
      message: "Blog deleted successfully" 
    });

  } catch (error) {
    console.error("Delete blog error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

