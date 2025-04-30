import AboutUsBannerCollection from "../../models/AboutUs/aboutbanner.js";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
//Accept start from Aboutus
import cleanUpFile from "../../utils/clearFilePath.js";
import { verifyAdmin } from "../../utils/adminverify.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "..", "..", ".env"),
});
const BASE_URL = process.env.BASE_URL;
export const UpdateAboutBanner = async (req, res) => {
  try {
    const adminid = req.adminid;
    let adminVerified = await verifyAdmin(adminid);
    if (!adminVerified) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized!",
      });
    }
    const {
      titleen,
      titlemy,
      abouten,
      aboutmy,
      blogtitleen,
      blogtitlemy,
      blogen,
      blogmy,
      introductionen,
      introductionmy,
      visionquoteen,
      visionquotemy,
      visiontexten,
      visiontextmy,
    } = req.body;

    // Validate required fields
    const requiredFields = {
      titleen,
      titlemy,
      abouten,
      aboutmy,
      blogtitleen,
      blogtitlemy,
      blogen,
      blogmy,
      introductionen,
      introductionmy,
      visionquoteen,
      visionquotemy,
      visiontexten,
      visiontextmy,
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      // Clean up uploaded files if validation fails
      if (req.files) {
        Object.values(req.files)
          .flat()
          .forEach((file) => {
            const filename = path.basename(file.path);
            const todeletePath = path.join("Aboutus", filename);
            cleanUpFile(todeletePath);
          });
      }
      return res.status(400).json({
        success: false,
        message: "Fields required!",
        missingFields,
      });
    }

    // Find existing banner with the admin token
    const existingBanner = await AboutUsBannerCollection.findOne({
      admins: adminid,
    });
    if (!existingBanner) {
      // Clean up uploaded files if no banner found
      if (req.files) {
        Object.values(req.files)
          .flat()
          .forEach((file) => {
            const filename = path.basename(file.path);
            const todeletePath = path.join("Aboutus", filename);
            cleanUpFile(todeletePath);
          });
        return res.status(404).json({
          success: false,
          message: "No about us banner found for this admin!",
        });
      }
    }
    // Handle file updates
    const updateData = { ...req.body };

    // Process banner background image if uploaded
    if (req.files?.bannerbgimg) {
      const newBannerImg = `/public/Aboutus/${req.files.bannerbgimg[0].filename}`;

      // Delete old banner image if exists
      if (existingBanner.bannerbgimg) {
        const oldPath = path.join(
          __dirname,
          "..",
          "..",
          existingBanner.bannerbgimg
        );
        const filename = path.basename(oldPath)
        //don't worry there is existSync in the cleanup function
        const todeletePath = path.join("Aboutus", filename);
        cleanUpFile(todeletePath);
      }

      updateData.bannerbgimg = newBannerImg;
    }

    // Process blog background image if uploaded
    if (req.files?.backgroundblogimg) {
      const newBlogImg = `/public/Aboutus/${req.files.backgroundblogimg[0].filename}`;

      // Delete old blog image if exists
      if (existingBanner.backgroundblogimg) {
        const oldPath = path.join(
          __dirname,
          "..",
          "..",
          existingBanner.backgroundblogimg
        );
        const filename = path.basename(oldPath)
        //don't worry there is existSync in the cleanup function
        const todeletePath = path.join("Aboutus", filename);
        cleanUpFile(todeletePath);
      }

      updateData.backgroundblogimg = newBlogImg;
    }

    // Update the document
    const updatedBanner = await AboutUsBannerCollection.findByIdAndUpdate(
      existingBanner._id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedBanner) {
      // Clean up uploaded files if update fails
      if (req.files) {
        Object.values(req.files)
          .flat()
          .forEach((file) => {
            const filename = path.basename(file.path);
            const todeletePath = path.join("Aboutus", filename);
            cleanUpFile(todeletePath);
          });
      }
      throw new Error("Failed to update about us banner");
    }

    return res.status(200).json({
      success: true,
      message: "About us banner updated successfully!",
      banner: updatedBanner,
    });
  } catch (error) {
    // Clean up uploaded files on error
    if (req.files) {
      Object.values(req.files)
        .flat()
        .forEach((file) => {
          const filename = path.basename(file.path);
          const todeletePath = path.join("Aboutus", filename);
          cleanUpFile(todeletePath);
        });
    }
    console.error("Update error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const GetAboutBanner = async (req, res) => {
  try {
    const { lang = "en" } = req.query; // Default to English if no lang provided

    // Validate language input
    if (!["en", "my"].includes(lang)) {
      return res.status(400).json({
        success: false,
        message: "Invalid language. Use 'en' or 'my'",
      });
    }

    // Fetch the banner (assuming one document exists)
    const banner = await AboutUsBannerCollection.findOne({});

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    // Construct full image URLs
    const bannerbgimgUrl = banner.bannerbgimg
      ? `${BASE_URL}${banner.bannerbgimg}`
      : null;
    const backgroundblogimgUrl = banner.backgroundblogimg
      ? `${BASE_URL}${banner.backgroundblogimg}`
      : null;

    // Structure the response based on language
    const response = {
      title: lang === "en" ? banner.titleen : banner.titlemy,
      about: lang === "en" ? banner.abouten : banner.aboutmy,
      images: {
        bannerbgimg: bannerbgimgUrl,
        backgroundblogimg: backgroundblogimgUrl,
      },
      blog: {
        title: lang === "en" ? banner.blogtitleen : banner.blogtitlemy,
        content: lang === "en" ? banner.blogen : banner.blogmy,
      },
      introduction:
        lang === "en" ? banner.introductionen : banner.introductionmy,
      vision: {
        quote: lang === "en" ? banner.visionquoteen : banner.visionquotemy,
        text: lang === "en" ? banner.visiontexten : banner.visiontextmy,
      },
    };

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("Error fetching about banner:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
