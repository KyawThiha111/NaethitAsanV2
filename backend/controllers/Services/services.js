import path from 'path';
import servicesCollection from '../../models/OurServices/services.js';
import adminCollection from '../../models/admin.js';
import { verifyAdmin } from '../../utils/adminverify.js'; // Adjust path as needed
import cleanUpFile from '../../utils/clearFilePath.js'; // Your utility to delete files
import dotenv from "dotenv";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path:path.join(__dirname,"..","..",".env")
})

export const CreateServices = async(req,res)=>{
   let logoPath = null;
   let imgPath = null;
   try {
    const adminid = req.adminid;
    const getalladmins = await adminCollection.find({},"_id");
     const alladminids = getalladmins.map((admin)=>admin._id);
    if(req.files?.logo){
        logoPath = path.basename(req.files.logo[0].filename)
    }
    if(req.files.img){
        imgPath = path.basename(req.files.img[0].filename)
    }
    /* Check Auth */
    const adminVerified = await verifyAdmin(adminid)
    if(!adminVerified){
        if(logoPath){
            const filename = path.basename(logoPath);
           const todeletePath = path.join("Services", logoPath);
           cleanUpFile(todeletePath);// delete the file
           }
        if(imgPath){
            const filename = path.basename(imgPath);
           const todeletePath = path.join("Services",imgPath);
           cleanUpFile(todeletePath);// delete the file
        }
        return res.status(403).json({success:false,message:"Unauthorized to add a service! Login first!"})
    }
    const {title_en,title_my,subtitle_en,subtitle_my,description_en,description_my,showonhomepage}= req.body;
    const requiredFields = {title_en,title_my,subtitle_en,subtitle_my,showonhomepage};
      const missingFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value)
        .map(([key]) => key);
       //Missing Fields
        if(missingFields.length>0){
            if(logoPath){
                const filename = path.basename(logoPath);
               const todeletePath = path.join("Services", logoPath);
               cleanUpFile(todeletePath);// delete the file
               }
            if(imgPath){
                const filename = path.basename(imgPath);
               const todeletePath = path.join("Services",imgPath);
               cleanUpFile(todeletePath);// delete the file
            }
            return res.status(400).json({
                success: false,
                message: "Fields required!",
                missingFields,
              });
        }
        /* Service exist */
        const serviceExist= await servicesCollection.findOne({
            $or: [{ title_en: title_en }, { title_my: title_my }],
          });
          if (serviceExist) {
            if(logoPath){
                const filename = path.basename(logoPath);
               const todeletePath = path.join("Services", logoPath);
               cleanUpFile(todeletePath);// delete the file
               }
            if(imgPath){
                const filename = path.basename(imgPath);
               const todeletePath = path.join("Services",imgPath);
               cleanUpFile(todeletePath);// delete the file
            }
            return res.status(409).json({
              // 409 Conflict is more appropriate
              success: false,
              message: "Service with the same name already exists.",
            });
          }
          let servicetoAdd ={
            title_en,
            title_my,
            subtitle_en,
            subtitle_my,
            description_en,
            description_my,
            showonhomepage,
            admins:alladminids,
            ...(imgPath && {img:`/public/Services/${imgPath}`}),
            ...(logoPath && {logo:`/public/Services/${logoPath}`})
          }

          const addnewService = await servicesCollection.create(servicetoAdd)
          if(!addnewService){
            if(logoPath){
                const filename = path.basename(logoPath);
               const todeletePath = path.join("Services", logoPath);
               cleanUpFile(todeletePath);// delete the file
               }
            if(imgPath){
                const filename = path.basename(imgPath);
               const todeletePath = path.join("Services",imgPath);
               cleanUpFile(todeletePath);// delete the file
            }
            return res.status(500).json({success:false,message:"Error while creating a new service!"})
          }
          return res.status(201).json({
            success: true,
            message: "Successfully added a new service!",
            service: addnewService,
          });
   } catch (error) {
    if(logoPath){
        const filename = path.basename(logoPath);
       const todeletePath = path.join("Services", logoPath);
       cleanUpFile(todeletePath);// delete the file
       }
    if(imgPath){
        const filename = path.basename(imgPath);
       const todeletePath = path.join("Services",imgPath);
       cleanUpFile(todeletePath);// delete the file
    }
    console.error("Service creation error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
   }
}

/* Update Services */
export const UpdateService = async (req, res) => {
    const serviceId = req.params.id;
    let logoPath = null;
    let imgPath = null;
    const adminid = req.adminid;
  
    try {
      if (req.files?.logo) {
        logoPath = path.basename(req.files.logo[0].filename);
      }
      if (req.files?.img) {
        imgPath = path.basename(req.files.img[0].filename);
      }
  
      // Check admin auth
      const adminVerified = await verifyAdmin(adminid);
      if (!adminVerified) {
        if (logoPath) cleanUpFile(path.join("Services", logoPath));
        if (imgPath) cleanUpFile(path.join("Services", imgPath));
        return res.status(403).json({ success: false, message: "Unauthorized! Please login as admin." });
      }
  
      const { title_en, title_my, subtitle_en, subtitle_my, description_en, description_my, showonhomepage } = req.body;
      const requiredFields = { title_en, title_my, subtitle_en, subtitle_my, showonhomepage };
      const missingFields = Object.entries(requiredFields).filter(([_, v]) => !v).map(([k]) => k);
  
      if (missingFields.length > 0) {
        if (logoPath) cleanUpFile(path.join("Services", logoPath));
        if (imgPath) cleanUpFile(path.join("Services", imgPath));
        return res.status(400).json({ success: false, message: "Missing required fields", missingFields });
      }
  
      const existingService = await servicesCollection.findById(serviceId);
      if (!existingService) {
        if (logoPath) cleanUpFile(path.join("Services", logoPath));
        if (imgPath) cleanUpFile(path.join("Services", imgPath));
        return res.status(404).json({ success: false, message: "Service not found" });
      }
  
      // If new images are provided, delete old ones
      if (imgPath && existingService.img) {
        const oldImgPath = existingService.img.replace("/public/", "");
        cleanUpFile(oldImgPath);
      }
      if (logoPath && existingService.logo) {
        const oldLogoPath = existingService.logo.replace("/public/", "");
        cleanUpFile(oldLogoPath);
      }
  
      const updatedFields = {
        title_en,
        title_my,
        subtitle_en,
        subtitle_my,
        description_en,
        description_my,
        showonhomepage,
        ...(imgPath && { img: `/public/Services/${imgPath}` }),
        ...(logoPath && { logo: `/public/Services/${logoPath}` }),
      };
  
      const updatedService = await servicesCollection.findByIdAndUpdate(
        serviceId,
        { $set: updatedFields },
        { new: true }
      );
  
      return res.status(200).json({
        success: true,
        message: "Service updated successfully!",
        service: updatedService,
      });
  
    } catch (error) {
      if (logoPath) cleanUpFile(path.join("Services", logoPath));
      if (imgPath) cleanUpFile(path.join("Services", imgPath));
      console.error("Service update error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? error.message : error.message,
      });
    }
  };
/* Get all services */
export const GetServices = async (req, res) => {
    try {
      const { lang, showonhomepage } = req.query;
  
      // Build MongoDB filter
      const filter = {};
  
      if (showonhomepage === "true" || showonhomepage === "false") {
        filter.showonhomepage = showonhomepage === "true";
      }
  
      const services = await servicesCollection.find(filter);
  
      if (!services || services.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No services found.",
        });
      }
  
      // Filter by language if specified
      let formattedServices = services;
  
      if (lang === "en" || lang === "my") {
        formattedServices = services.map(service => ({
          _id: service._id,
          title: service[`title_${lang}`],
          subtitle: service[`subtitle_${lang}`],
          description: service[`description_${lang}`],
          logo: service.logo,
          img: service.img,
          showonhomepage: service.showonhomepage,
        }));
      }
  
      return res.status(200).json({
        success: true,
        count: formattedServices.length,
        services: formattedServices,
      });
  
    } catch (error) {
      console.error("Error getting services:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
};

export const GetSingleService = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Check for valid MongoDB ObjectId
      if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({
          success: false,
          message: "Invalid service ID.",
        });
      }
  
      const service = await servicesCollection.findById(id).lean();
  
      if (!service) {
        return res.status(404).json({
          success: false,
          message: "Service not found.",
        });
      }
  
      // Exclude internal fields if needed
      const {
        _id,
        title_en,
        title_my,
        subtitle_en,
        subtitle_my,
        description_en,
        description_my,
        logo,
        img,
        showonhomepage,
        createdAt,
        updatedAt,
      } = service;
  
      return res.status(200).json({
        success: true,
        service: {
          _id,
          title_en,
          title_my,
          subtitle_en,
          subtitle_my,
          description_en,
          description_my,
          logo,
          img,
          showonhomepage,
          createdAt,
          updatedAt,
        },
      });
  
    } catch (error) {
      console.error("Get single service error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  };

/* Deleting */
export const DeleteService = async (req, res) => {
    const serviceId = req.params.id;
    const adminid = req.adminid;
  
    try {
      // Verify admin
      const adminVerified = await verifyAdmin(adminid);
      if (!adminVerified) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized! Please login as admin."
        });
      }
  
      const service = await servicesCollection.findById(serviceId);
      if (!service) {
        return res.status(404).json({
          success: false,
          message: "Service not found."
        });
      }
  
      // Delete associated files
      if (service.img) {
        const imgPath = path.basename(service.img)
        cleanUpFile(path.join("Services",imgPath));
      }
      if (service.logo) {
        const logoPath = path.basename(service.logo)
        cleanUpFile(path.join("Services",logoPath));
      }
  
      // Delete the service
      await servicesCollection.findByIdAndDelete(serviceId);
  
      return res.status(200).json({
        success: true,
        message: "Service deleted successfully."
      });
    } catch (error) {
      console.error("Delete service error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  };
  
  
  
  