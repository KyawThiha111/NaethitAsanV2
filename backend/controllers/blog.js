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
    const getalladmins = await adminCollection.find({}, "_id");
    const alladminids = getalladmins.map((admin) => admin._id);
    const {
      titleen,
      titlemy,
      descriptionen,
      descriptionmy,
      timelength,
      catagory,
      postdate
    } = req.body;

    // Validate required fields (removed postdate from required fields)
    const requiredFields = {
      titleen,
      titlemy,
      descriptionen,
      descriptionmy,
      timelength,
      catagory,
      postdate
    };

    // Set file path if file exists
    if (req.file) {
      filePath = path.join(__dirname, "..", "public", "Blog", req.file.filename);
    }

    // Verify admin
    const adminverified = await verifyAdmin(adminid);
    if (!adminverified) {
      if (filePath) {
        const filename = path.basename(filePath);
        const todeletePath = path.join("Blog", filename);
        cleanUpFile(todeletePath);
      }
      return res.status(403).json({
        success: false,
        message: "Unauthorized - Invalid admin credentials",
      });
    }

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      if (filePath) {
        const filename = path.basename(filePath);
        const todeletePath = path.join("Blog", filename);
        cleanUpFile(todeletePath);
      }
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
      if (filePath) {
        const filename = path.basename(filePath);
        const todeletePath = path.join("Blog", filename);
        cleanUpFile(todeletePath);
      }
      return res.status(409).json({
        success: false,
        message: "Post with this title already exists.",
      });
    }

    const toUploadBlog = {
      titleen,
      titlemy,
      descriptionen,
      descriptionmy,
      timelength,
      catagory,
      postdate,
      admins: alladminids,
      ...(req.file && { img: `/public/Blog/${req.file.filename}` }),
    };

    // Create new blog
    const createdBlog = await BlogCollection.create(toUploadBlog);

    if (!createdBlog) {
      if (filePath) {
        const filename = path.basename(filePath);
        const todeletePath = path.join("Blog", filename);
        cleanUpFile(todeletePath);
      }
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
      const filename = path.basename(filePath);
      const todeletePath = path.join("Blog", filename);
      cleanUpFile(todeletePath);
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
      timelength,
      catagory,
      postdate
    } = req.body; // Removed postdate from destructuring

    // Set file paths for cleanup
    if (req.file) {
      newFilePath = req.file.path;
      // Store old file path if it exists
      const existingBlog = await BlogCollection.findById(blogid);
      if (existingBlog?.img) {
        oldFilePath = path.join(__dirname, "..", existingBlog.img);
      }
    }

    // Validate required fields (removed postdate from validation)
    const requiredFields = {
      titleen,
      titlemy,
      descriptionen,
      descriptionmy,
      timelength,
      catagory,
      postdate
    };
    
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      if (newFilePath) {
        const filename = path.basename(newFilePath);
        const todeletePath = path.join("Blog", filename);
        cleanUpFile(todeletePath);
      }
      return res.status(400).json({ 
        success: false, 
        message: "Fields required!", 
        missingFields 
      });
    }

    // Verify admin first
    const adminverified = await verifyAdmin(adminid);
    if (!adminverified) {
      if (newFilePath) {
        const filename = path.basename(newFilePath);
        const todeletePath = path.join("Blog", filename);
        cleanUpFile(todeletePath);
      }
      return res.status(403).json({
        success: false,
        message: "Unauthorized - Invalid admin credentials"
      });
    }

    // Check if blog exists and admin has permission
    const existingBlog = await BlogCollection.findById(blogid);
    if (!existingBlog) {
      if (newFilePath) {
        const filename = path.basename(newFilePath);
        const todeletePath = path.join("Blog", filename);
        cleanUpFile(todeletePath);
      }
      return res.status(404).json({ 
        success: false, 
        message: "Blog not found!" 
      });
    }

    // Check if admin is in the admins array
    if (!existingBlog.admins.includes(adminid)) {
      if (newFilePath) {
        const filename = path.basename(newFilePath);
        const todeletePath = path.join("Blog", filename);
        cleanUpFile(todeletePath);
      }
      return res.status(403).json({
        success: false,
        message: "Unauthorized! You don't have permission to update this blog!",
      });
    }

    // Prepare update data - keep original postdate and add updatedAt
    const updateData = {
      titleen,
      titlemy,
      descriptionen,
      descriptionmy,
      timelength,
      catagory,
      postdate,
      ...(req.file && { img: `/public/Blog/${req.file.filename}` }),
      updatedAt: new Date() // Set current timestamp for update
    };

    // Update the blog - preserving original postdate
    const updatedBlog = await BlogCollection.findByIdAndUpdate(
      blogid,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      if (newFilePath) {
        const filename = path.basename(newFilePath);
        const todeletePath = path.join("Blog", filename);
        cleanUpFile(todeletePath);
      }
      throw new Error("Failed to update blog");
    }

    // Clean up old file after successful update
    if(newFilePath){
      if(oldFilePath) {
        const filename = path.basename(oldFilePath);
        const todeletePath = path.join("Blog", filename);
        cleanUpFile(todeletePath);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Successfully updated the blog!",
      blog: updatedBlog
    });

  } catch (error) {
    // Clean up new file if error occurred
    if (newFilePath) {
      const filename = path.basename(newFilePath);
      const todeletePath = path.join("Blog", filename);
      cleanUpFile(todeletePath);
    }
    console.error("Blog update error:", error);
    
    return res.status(500).json({
      success: false,
      message: "Internal server error!",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// getallblog
export const GetAllBlog = async (req, res) => {
  try {
    const { lang } = req.query;

    let projection = {
      postdate: 1,
      timelength: 1,
      catagory: 1,
      img: 1,
      admins: 1,
      createdAt: 1,
      updatedAt: 1,
    };

    if (lang === "en" || lang === "my") {
      projection[`title${lang}`] = 1;
      projection[`description${lang}`] = 1;
    } else if (lang === undefined) {
      // No lang specified, return both languages
      projection["titleen"] = 1;
      projection["descriptionen"] = 1;
      projection["titlemy"] = 1;
      projection["descriptionmy"] = 1;
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid language. Use lang=en or lang=my",
      });
    }

    const blogs = await BlogCollection.find({}, projection)
      .sort({ postdate: -1 })

    if (!blogs || blogs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No blogs found",
      });
    }

    const formattedBlogs = blogs.map((blog) => {
      const formatted = {
        id: blog._id,
        postdate: blog.postdate,
        timelength: blog.timelength,
        category: blog.catagory,
        image: `${BASE_URL}${blog.img}`,
        admins: blog.admins,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt
      };

      if (lang === "en" || lang === "my") {
        formatted.title = blog[`title${lang}`];
        formatted.description = blog[`description${lang}`];
      } else {
        // Include both if no lang specified
        formatted.title = {
          en: blog.titleen,
          my: blog.titlemy
        };
        formatted.description = {
          en: blog.descriptionen,
          my: blog.descriptionmy
        };
      }

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


// getsingleblog
export const GetSingleBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { lang } = req.query;

    let projection = {
      postdate: 1,
      timelength: 1,
      catagory: 1,
      img: 1,
      admins: 1,
      createdAt: 1,
      updatedAt: 1,
    };

    if (lang === "en" || lang === "my") {
      projection[`title${lang}`] = 1;
      projection[`description${lang}`] = 1;
    } else if (lang === undefined) {
      // No lang specified, return both languages
      projection["titleen"] = 1;
      projection["descriptionen"] = 1;
      projection["titlemy"] = 1;
      projection["descriptionmy"] = 1;
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid language. Use lang=en or lang=my",
      });
    }

    const blog = await BlogCollection.findById(id, projection);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const formatted = {
      id: blog._id,
      postdate: blog.postdate,
      timelength: blog.timelength,
      category: blog.catagory,
      image: `${BASE_URL}${blog.img}`,
      admins: blog.admins,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    };

    if (lang === "en" || lang === "my") {
      formatted.title = blog[`title${lang}`];
      formatted.description = blog[`description${lang}`];
    } else {
      formatted.title = {
        en: blog.titleen,
        my: blog.titlemy,
      };
      formatted.description = {
        en: blog.descriptionen,
        my: blog.descriptionmy,
      };
    }

    return res.status(200).json({
      success: true,
      blog: formatted,
    });

  } catch (error) {
    console.error("Get single blog error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};


// GET /api/pages/blogsoncata?catagory=Events&lang=en
export const GetBlogsByCategory = async (req, res) => {
  try {
    const { catagory, lang } = req.query;

    // Validate language if provided
    if (lang && !['en', 'my'].includes(lang)) {
      return res.status(400).json({
        success: false,
        message: "Invalid language parameter. Use 'en' or 'my'"
      });
    }

    // Build category filter
    const filter = {};
    if (catagory && catagory !== 'All') {
      filter.catagory = catagory;
    }

    // Fields to retrieve - using 'img' to match your database field
    const projection = {
      titleen: 1,
      titlemy: 1,
      descriptionen: 1,
      descriptionmy: 1,
      catagory: 1,
      img: 1,  // Changed from 'image' to 'img' to match your schema
      postdate: 1,
      timelength: 1,
      admins: 1,
      createdAt: 1,
      updatedAt: 1
    };

    const blogs = await BlogCollection.find(filter, projection)
      .sort({ postdate: -1 })

    if (!blogs || blogs.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No blogs found${catagory ? ` in ${catagory} category` : ''}`
      });
    }

    // Format response - using 'img' to match your schema
    const formattedBlogs = blogs.map(blog => {
      const base = {
        id: blog._id,
        catagory: blog.catagory,
        image: blog.img ? `${BASE_URL}${blog.img}` : null, // Changed from blog.image to blog.img
        postdate: blog.postdate,
        timelength: blog.timelength,
        authors: blog.admins,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt
      };

      if (lang === 'en') {
        return {
          ...base,
          title: blog.titleen || null,
          description: blog.descriptionen || null
        };
      } else if (lang === 'my') {
        return {
          ...base,
          title: blog.titlemy || null,
          description: blog.descriptionmy || null
        };
      } else {
        return {
          ...base,
          title: {
            en: blog.titleen || null,
            my: blog.titlemy || null
          },
          description: {
            en: blog.descriptionen || null,
            my: blog.descriptionmy || null
          }
        };
      }
    });

    return res.status(200).json({
      success: true,
      count: blogs.length,
      catagory: catagory || 'All',
      blogs: formattedBlogs
    });

  } catch (error) {
    console.error('Get blogs by category error:', error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

/* Get Blog Pagination */
export const GetBlogsPagination = async (req, res) => {
  try {
    const { catagory, lang, page = 1 } = req.query; // Add page parameter
    const perPage = 4; // Items per page

    // Validate language if provided
    if (lang && !['en', 'my'].includes(lang)) {
      return res.status(400).json({
        success: false,
        message: "Invalid language parameter. Use 'en' or 'my'"
      });
    }

    // Validate page number
    const pageNumber = parseInt(page);
    if(isNaN(pageNumber)){
      return res.status(400).json({
        success: false,
        message: "Invalid page number"
      });
    }

    // Build category filter
    const filter = {};
    if (catagory && catagory !== 'All') {
      filter.catagory = catagory;
    }

    // Fields to retrieve
    const projection = {
      titleen: 1,
      titlemy: 1,
      descriptionen: 1,
      descriptionmy: 1,
      catagory: 1,
      img: 1,
      postdate: 1,
      timelength: 1,
      admins: 1,
      createdAt: 1,
      updatedAt: 1
    };

    // Get total count for pagination info
    const totalBlogs = await BlogCollection.countDocuments(filter);

    // Calculate total pages
    const totalPages = Math.ceil(totalBlogs / perPage);

    // Get paginated blogs
    const blogs = await BlogCollection.find(filter, projection)
      .sort({ postdate: -1 })
      .skip((pageNumber - 1) * perPage)
      .limit(perPage)
      .populate('admins', 'adminname email');

    if (!blogs || blogs.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No blogs found${catagory ? ` in ${catagory} category` : ''}`
      });
    }

    // Format response
    const formattedBlogs = blogs.map(blog => {
      const base = {
        id: blog._id,
        catagory: blog.catagory,
        image: blog.img ? `${BASE_URL}${blog.img}` : null,
        postdate: blog.postdate,
        timelength: blog.timelength,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt
      };

      if (lang === 'en') {
        return {
          ...base,
          title: blog.titleen || null,
          description: blog.descriptionen || null
        };
      } else if (lang === 'my') {
        return {
          ...base,
          title: blog.titlemy || null,
          description: blog.descriptionmy || null
        };
      } else {
        return {
          ...base,
          title: {
            en: blog.titleen || null,
            my: blog.titlemy || null
          },
          description: {
            en: blog.descriptionen || null,
            my: blog.descriptionmy || null
          }
        };
      }
    });

    return res.status(200).json({
      success: true,
      count: formattedBlogs.length,
      total: totalBlogs,
      totalPages: totalPages,
      currentPage: pageNumber,
      catagory: catagory || 'All',
      blogs: formattedBlogs
    });

  } catch (error) {
    console.error('Get blogs by category error:', error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
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
      const filename = path.basename(imagePath);
      const todeletePath = path.join("Blog", filename);
      cleanUpFile(todeletePath);
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





