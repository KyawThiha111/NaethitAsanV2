import servicepageDataCollection from "../../models/OurServices/pagedata.js";
import adminCollection from "../../models/admin.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
import { verifyAdmin } from "../../utils/adminverify.js";
import cleanUpFile from "../../utils/clearFilePath.js";
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "..", "..", ".env"),
});

export const EditServiceData = async (req, res) => {
  try {
    const adminid = req.adminid;
    let isAdminVerified = await verifyAdmin(adminid);
    if (!isAdminVerified) {
      if (req.files) {
        Object.values(req.files)
          .flat()
          .forEach((file) => {
            const filename = path.basename(file.path);
            const todeletePath = path.join("Services", filename);
            cleanUpFile(todeletePath);
          });
      }
      return res.status(403).json({
        success: false,
        message: "Unauthorized!",
      });
    }
    const {
      header_en,
      header_my,
      subheader_en,
      subheader_my,
      blog1_en,
      blog1_my,
      blog2_en,
      blog2_my,
    } = req.body;
    const requiredFields = {
        header_en,
        header_my,
        subheader_en,
        subheader_my,
        blog1_en,
        blog1_my,
        blog2_en,
        blog2_my,
    }
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
            const todeletePath = path.join("Services", filename);
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
      const existingBanner = await servicepageDataCollection.findOne({
        admins: adminid,
      });
      if (!existingBanner) {
        // Clean up uploaded files if no banner found
        if (req.files) {
          Object.values(req.files)
            .flat()
            .forEach((file) => {
              const filename = path.basename(file.path);
              const todeletePath = path.join("Services", filename);
              cleanUpFile(todeletePath);
            });
          return res.status(404).json({
            success: false,
            message: "No service banner found to edit for this admin!",
          });
        }
      }

      /* Handle file Update */
      const toUpdateData = {...req.body};
      if(req.files?.banner_bg_img){
        const newBannerBgImg = `/public/Services/${req.files.banner_bg_img[0].filename}`;
        /* Delete old photo */
        if(existingBanner.banner_bg_img){
            const oldPath = path.join(__dirname,"..","..",existingBanner.banner_bg_img);
            const filename = path.basename(oldPath)
            const todeletePath = path.join("Services", filename);
            cleanUpFile(todeletePath);
        }
        toUpdateData.banner_bg_img = newBannerBgImg;
      }
      /* Blog1 img */
      if(req.files?.blog1_img){
        const newBlog1Img = `/public/Services/${req.files.blog1_img[0].filename}`;
        /* Delete old photo */
        if(existingBanner.blog1_img){
            const oldPath = path.join(__dirname,"..","..",existingBanner.blog1_img);
            const filename = path.basename(oldPath)
            const todeletePath = path.join("Services", filename);
            cleanUpFile(todeletePath);
        }
        toUpdateData.blog1_img = newBlog1Img;
      }
      /* Blog2 img */
      if(req.files?.blog2_img){
        const newBlog2Img = `/public/Services/${req.files.blog2_img[0].filename}`;
        /* Delete old photo */
        if(existingBanner.blog2_img){
            const oldPath = path.join(__dirname,"..","..",existingBanner.blog2_img);
            const filename = path.basename(oldPath)
            const todeletePath = path.join("Services", filename);
            cleanUpFile(todeletePath);
        }
        toUpdateData.blog2_img = newBlog2Img;
      }

      const UpdateServiceData = await servicepageDataCollection.findByIdAndUpdate(
        existingBanner._id,
        toUpdateData,
        { new: true, runValidators: true }
      )
      if(!UpdateServiceData){
        if (req.files) {
            Object.values(req.files)
              .flat()
              .forEach((file) => {
                const filename = path.basename(file.path);
                const todeletePath = path.join("Services", filename);
                cleanUpFile(todeletePath);
              });
          }
          throw new Error("Failed to update service data banner");
      }
      return res.status(200).json({
        success: true,
        message: "Service banner updated successfully!",
        banner: UpdateServiceData,
      });
  } catch (error) {
     if (req.files) {
          Object.values(req.files)
            .flat()
            .forEach((file) => {
              const filename = path.basename(file.path);
              const todeletePath = path.join("Services", filename);
              cleanUpFile(todeletePath);
            });
        }
        console.error("Update error:", error);
        return res.status(500).json({
          success: false,
          message: `Internal server error ${error.message}`,
          error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
  }
};

export const GetServiceData = async (req, res) => {
    try {
      const { lang } = req.query;
      
      // Get the single document from the collection
      const serviceData = await servicepageDataCollection.findOne();
      
      if (!serviceData) {
        return res.status(404).json({
          success: false,
          message: "Service page data not found",
        });
      }
  
      // If no language specified, return both languages
      if (!lang) {
        return res.status(200).json({
          success: true,
          data: serviceData
        });
      }
  
      // If language is specified, filter the response
      if (lang === 'en' || lang === 'my') {
        const filteredData = {
          banner_bg_img: serviceData.banner_bg_img,
          blog1_img: serviceData.blog1_img,
          blog2_img: serviceData.blog2_img,
          header: serviceData[`header_${lang}`],
          subheader: serviceData[`subheader_${lang}`],
          blog1: serviceData[`blog1_${lang}`],
          blog2: serviceData[`blog2_${lang}`],
          createdAt: serviceData.createdAt,
          updatedAt: serviceData.updatedAt
        };
  
        return res.status(200).json({
          success: true,
          data: filteredData
        });
      }
  
      // If language is invalid
      return res.status(400).json({
        success: false,
        message: "Invalid language parameter. Use 'en' or 'my' or omit for all languages."
      });
  
    } catch (error) {
      console.error("Get service data error:", error);
      return res.status(500).json({
        success: false,
        message: `Internal server error ${error.message}`,
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  };
