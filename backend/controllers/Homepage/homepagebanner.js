import cleanUpFile from "../../utils/clearFilePath.js";
import adminCollection from "../../models/admin.js";
import HomepagebannerCollection from "../../models/HomePage/banner.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { verifyAdmin } from "../../utils/adminverify.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({
  path: path.join(__dirname, "..", "..", ".env"),
});

export const UpdateHomeBanner = async (req, res) => {
    let newBgImgPath = null;
    let newBlogImgPath = null;
    const adminid = req.adminid;

    try {
      if (req.files?.homepage_banner_bg) {
        newBgImgPath = path.basename(req.files.homepage_banner_bg[0].filename);
      }
      if(req.files?.homepage_blog_img){
        newBlogImgPath = path.basename(req.files.homepage_blog_img[0].filename)
      }
      /* Verify admin */
      const adminVerified = await verifyAdmin(adminid);
      if (!adminVerified) {
        if(newBgImgPath) cleanUpFile(path.join("Homepage",newBgImgPath))
        if(newBlogImgPath) cleanUpFile(path.join("Homepage",newBlogImgPath))
        return res.status(403).json({
          success: false,
          message: "Unauthorized to update the homepage! Login first!",
        });
      }
  
      /* Check Forms */
      const {
        header_en,
        header_my,
        description_en,
        description_my,
        homepageblog_title_en,
        homepageblog_title_my,
        homepageblog_subtitle_en,
        homepageblog_subtitle_my,
        homepageblog_my,
        homepageblog_en,
        yos_en,
        yos_my,
        nop_en,
        nop_my,
        nom_en,
        nom_my,
        tps_en,
        tps_my,
      } = req.body;
  
      const requiredFields = {
        header_en,
        header_my,
        description_en,
        description_my,
        homepageblog_title_en,
        homepageblog_title_my,
        homepageblog_en,
        homepageblog_my,
        yos_en,
        yos_my,
        nop_en,
        nop_my,
        nom_en,
        nom_my,
        tps_en,
        tps_my,
      };
  
      const missingFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value)
        .map(([key]) => key);
  
      if (missingFields.length > 0) {
        if(newBgImgPath) cleanUpFile(path.join("Homepage",newBgImgPath))
        if(newBlogImgPath) cleanUpFile(path.join("Homepage",newBlogImgPath))
        return res.status(400).json({
          success: false,
          message: "Fields required!",
          missingFields,
        });
      }
  
      // Use findOne instead of find
      const existingHomepageBanner = await HomepagebannerCollection.findOne({ admins: adminid });
      
      if (!existingHomepageBanner) {
       if(newBgImgPath) cleanUpFile(path.join("Homepage",newBgImgPath))
        if(newBlogImgPath) cleanUpFile(path.join("Homepage",newBlogImgPath))
        return res.status(404).json({
          success: false,
          message: "No banner found to update!",
        });
      }
  
      const ToUpdateData = { 
        ...req.body,
         homepage_banner_bg: newBgImgPath ? `/public/Homepage/${newBgImgPath}` : existingHomepageBanner.homepage_banner_bg,
         homepage_blog_img: newBlogImgPath ? `/public/Homepage/${newBlogImgPath}` : existingHomepageBanner.homepage_blog_img
       };
  
      const updateBanner = await HomepagebannerCollection.findByIdAndUpdate(
        existingHomepageBanner._id,
        ToUpdateData,
        { new: true, runValidators: true }
      );
  
      if (!updateBanner) {
      if(newBgImgPath) cleanUpFile(path.join("Homepage",newBgImgPath))
        if(newBlogImgPath) cleanUpFile(path.join("Homepage",newBlogImgPath))
        return res.status(400).json({
          success: false,
          message: "Error occurred while updating the banner!",
        });
      }
      
      /* Get old photo to delete */
      if (existingHomepageBanner.homepage_banner_bg && newBgImgPath) {
       let oldfilename = path.basename(existingHomepageBanner.homepage_banner_bg);
        const todeletePath = path.join("Homepage", oldfilename);
        cleanUpFile(todeletePath);
      }
     if(existingHomepageBanner.homepage_blog_img&& newBlogImgPath){
     let oldfilename =path.basename(existingHomepageBanner.homepage_blog_img);
      const todeletePath = path.join("Homepage",oldfilename)
      cleanUpFile(todeletePath)
     }
      return res.status(200).json({
        success: true,
        message: "Homepage banner updated successfully!",
        banner: updateBanner,
      });
  
    } catch (error) {
      if(newBgImgPath) cleanUpFile(path.join("Homepage",newBgImgPath))
        if(newBlogImgPath) cleanUpFile(path.join("Homepage",newBlogImgPath))
      console.error("Update error:", error);
      return res.status(500).json({
        success: false,
        message: `Internal server error ${error.message}`,
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  };


  export const GetHomeBanner = async (req, res) => {
    const { lang } = req.query;
    
    try {
      // Base projection always includes the banner image
      const projection = {
        homepage_banner_bg: 1,
        homepage_blog_img:1,
        createdAt: 1,
        updatedAt: 1
      };
  
      // Language-specific projections
      if (lang === "en" || lang === "my") {
        // Include only the requested language fields
        projection[`header_${lang}`] = 1;
        projection[`description_${lang}`] = 1;
        projection[`homepageblog_title_${lang}`] = 1;
        projection[`homepageblog_subtitle_${lang}`] = 1;
        projection[`homepageblog_${lang}`] = 1;
        projection[`yos_${lang}`] = 1;
        projection[`nop_${lang}`] = 1;
        projection[`nom_${lang}`] = 1;
        projection[`tps_${lang}`] = 1;
      } else {
        // Include all language fields when no specific language is requested
        projection.header_en = 1;
        projection.header_my = 1;
        projection.description_en = 1;
        projection.description_my = 1;
        projection.homepageblog_title_en = 1;
        projection.homepageblog_title_my = 1;
        projection.homepageblog_subtitle_en = 1;
        projection.homepageblog_subtitle_my = 1;
        projection.homepageblog_en = 1;
        projection.homepageblog_my = 1;
        projection.yos_en = 1;
        projection.yos_my = 1;
        projection.nop_en = 1;
        projection.nop_my = 1;
        projection.nom_en = 1;
        projection.nom_my = 1;
        projection.tps_en = 1;
        projection.tps_my = 1;
      }
  
      const homepagebanner = await HomepagebannerCollection.find({}, projection)
        .sort({ createdAt: -1 })
        .lean(); // Using lean() for better performance
     console.log(homepagebanner)
      if (!homepagebanner || homepagebanner.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No homepage banner found",
        });
      }
  
      // Format the response data
      const formattedBanners = homepagebanner.map(banner => {
        const formattedBanner = {
          id: banner._id,
          homepage_banner_bg: banner.homepage_banner_bg||null,
          homepage_blog_img: banner.homepage_blog_img||null,
          createdAt: banner.createdAt,
          updatedAt: banner.updatedAt
        };
  
        if (lang === "en" || lang === "my") {
          // Single language response
          formattedBanner.header = banner[`header_${lang}`];
          formattedBanner.description = banner[`description_${lang}`];
          formattedBanner.homepageblog_title = banner[`homepageblog_title_${lang}`];
          formattedBanner.homepageblog_subtitle = banner[`homepageblog_subtitle_${lang}`];
          formattedBanner.homepageblog = banner[`homepageblog_${lang}`];
          formattedBanner.yos = banner[`yos_${lang}`];
          formattedBanner.nop = banner[`nop_${lang}`];
          formattedBanner.nom = banner[`nom_${lang}`];
          formattedBanner.tps = banner[`tps_${lang}`];
        } else {
          // Dual language response with _en and _my suffixes
          formattedBanner.header_en = banner.header_en;
          formattedBanner.header_my = banner.header_my;
          formattedBanner.description_en = banner.description_en;
          formattedBanner.description_my = banner.description_my;
          formattedBanner.homepageblog_title_en = banner.homepageblog_title_en;
          formattedBanner.homepageblog_title_my = banner.homepageblog_title_my;
          formattedBanner.homepageblog_subtitle_en = banner.homepageblog_subtitle_en;
          formattedBanner.homepageblog_subtitle_my = banner.homepageblog_subtitle_my;
          formattedBanner.homepageblog_en = banner.homepageblog_en;
          formattedBanner.homepageblog_my = banner.homepageblog_my;
          formattedBanner.yos_en = banner.yos_en;
          formattedBanner.yos_my = banner.yos_my;
          formattedBanner.nop_en = banner.nop_en;
          formattedBanner.nop_my = banner.nop_my;
          formattedBanner.nom_en = banner.nom_en;
          formattedBanner.nom_my = banner.nom_my;
          formattedBanner.tps_en = banner.tps_en;
          formattedBanner.tps_my = banner.tps_my;
        }
  
        return formattedBanner;
      });
  
      return res.status(200).json({
        success: true,
        data: formattedBanners[0],
      });
  
    } catch (error) {
      console.error("GetHomeBanner error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  };