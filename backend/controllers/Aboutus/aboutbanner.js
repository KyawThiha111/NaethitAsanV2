import AboutUsBannerCollection from "../../models/AboutUs/aboutbanner.js";
import path from "path"
import fs from "fs"
import dotenv from "dotenv"
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
    path:path.join(__dirname,"..","..",".env")
})
export const UpdateAboutBanner = async(req,res)=>{
   try {
    const adminid = req.adminid;
    const {headeren,headermy,descriptionen,descriptionmy,storytitleen,storytitlemy,storyblogen,storyblogmy,visionemoji,visiontitleen,visiontitlemy,visionen,visionmy,missionemoji,missiontitleen,missiontitlemy,missionen,missionmy} = req.body;
    /* Check the mssing key */
    const requiredFields ={headeren,headermy,descriptionen,descriptionmy,storytitleen,storytitlemy,storyblogen,storyblogmy,visionemoji,visiontitleen,visiontitlemy,visionen,visionmy,missionemoji,missiontitleen,missiontitlemy,missionen,missionmy}
    const missingFields = Object.entries(requiredFields).filter(([_,value])=>!value).map(([key])=>key);
    
    if(missingFields.length>0){
        return res.status(400).json({success:false,message:"Fields required!",missingFields})
    }
   /* Find the banner. It's one and only banner posted by the admin */
    const AboutUsBanner = await AboutUsBannerCollection.findOne({admin:adminid})
   if(!AboutUsBanner){
    return res.status(400).json({success:false,message:"No aboutus banner found! Check aboutusupdate.js. Can be wrong admin id!"})
   }
   /* Img handle */
   if(req.file){
    const allowedMimeTypes =  ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const ext = path.extname(req.file.originalname).toLowerCase();
     if(!allowedMimeTypes.includes(req.file.mimetypes)&&ext!==".jfif"){
        fs.unlinkSync(req.file.path);
        return res.status(400).json({success:false,message:"Invalid image format!"})
     }
     /* Delete the old image */
      if(AboutUsBanner.bannerbgPhoto){
        const oldimgpath = path.join(__dirname,"..","..",AboutUsBanner.bannerbgPhoto)
        if(fs.existsSync(oldimgpath)){
              fs.unlinkSync(oldimgpath)
        }   
      }
   }
   /* Generate new URL */
   let newphotoUrl;
   if(req.file){
     newphotoUrl = `/public/Aboutus/${req.file.filename}`
   }
    /* Update the banner */
    const updatedAboutUsBanner = await AboutUsBannerCollection.findByIdAndUpdate(AboutUsBanner._id,{...req.body,admin:adminid,bannerbgPhoto:newphotoUrl},{new:true,runValidators:true})
    if(!updatedAboutUsBanner){
        throw new Error("Failed to update the aboutus banner!")
    }
    return res.status(200).json({success:true,message:"Successfully updated the banner!",banner:updatedAboutUsBanner})
} catch (error) {
    console.log("Banner updated error!")
    return res.status(500).json({success:false,message:"Internal server error!",error:process.env.NODE_ENV==="development"?error.message:undefined})
   }
}

export const GetAboutBanner = async (req, res) => {
    try {
      const { lang = 'en' } = req.query; // Default to English if no lang provided
  
      // Validate language input
      if (!['en', 'my'].includes(lang)) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid language. Use 'en' or 'my'" 
        });
      }
  
      // Fetch the banner (assuming one document exists)
      const banner = await AboutUsBannerCollection.findOne({});
  
      if (!banner) {
        return res.status(404).json({ 
          success: false, 
          message: "Banner not found" 
        });
      }
  
      // Structure the response based on language
      const response = {       
        bannerbgPhoto:banner.bannerbgPhoto,
        emoji: banner.emoji,
        header: lang === 'en' ? banner.headeren : banner.headermy,
        description: lang === 'en' ? banner.descriptionen : banner.descriptionmy,
        storyTitle: lang === 'en' ? banner.storytitleen : banner.storytitlemy,
        storyBlog: lang === 'en' ? banner.storyblogen : banner.storyblogmy,
        vision: {
          emoji: banner.visionemoji,
          title: lang === 'en' ? banner.visiontitleen : banner.visiontitlemy,
          text: lang === 'en' ? banner.visionen : banner.visionmy
        },
        mission: {
          emoji: banner.missionemoji,
          title: lang === 'en' ? banner.missiontitleen : banner.missiontitlemy,
          text: lang === 'en' ? banner.missionen : banner.missionmy
        }
      };
  
      res.status(200).json({ 
        success: true, 
        data: response 
      });
  
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "Server error",
        error: process.env.NODE_ENV === "development" ? error.message : undefined 
      });
    }
  };