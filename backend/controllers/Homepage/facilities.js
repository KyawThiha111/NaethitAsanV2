import path from 'path';
import facilitiesCollection from '../../models/HomePage/facilities.js'; // Adjust path as needed
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
export const CreateFacility = async (req, res) => {
  let filePath = null;

  try {
    const adminid = req.adminid;
    const getalladmins = await adminCollection.find({}, "_id");
    const alladminids = getalladmins.map((admin) => admin._id);

    const { clinicname_en,clinicname_my,openinghr_en,openinghr_my,mapurl,address_en,address_my } = req.body;

    // Handle uploaded image
    if (req.file) {
      filePath = path.join(__dirname,"..","..","public","Homepage", req.file.filename);
    }

    // Admin verification
    const adminVerified = await verifyAdmin(adminid);
    if (!adminVerified) {
      if (filePath) {
        cleanUpFile(path.join("Homepage", path.basename(filePath)));
      }
      return res.status(403).json({
        success: false,
        message: "Unauthorized - Invalid admin credentials",
      });
    }

    //Fields Validation
    const requiredFields = {clinicname_en,clinicname_my,openinghr_en,openinghr_my,mapurl,address_en,address_my};
     const missingFields = Object.entries(requiredFields)
          .filter(([_, value]) => !value)
          .map(([key]) => key);
    
        if (missingFields.length > 0) {
          // Clean up uploaded files if validation fails
          if (filePath) {
            cleanUpFile(path.join("Homepage", path.basename(filePath)));
          }
          return res.status(400).json({
            success: false,
            message: "Fields required!",
            missingFields,
          });
        }

    const toUploadFacility = {
      clinicname_en,
      clinicname_my,
      openinghr_en,
      openinghr_my,
      address_en,
      address_my,
      mapurl,
      photo: `/public/Homepage/${req.file.filename}`,
      admins: alladminids,
    };

    const createdFacility = await facilitiesCollection.create(toUploadFacility);

    if (!createdFacility) {
      if (filePath) {
        cleanUpFile(path.join("Homepage", path.basename(filePath)));
      }
      return res.status(500).json({
        success: false,
        message: "Error while creating facility!",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Facility added successfully!",
      facility: createdFacility,
    });
  } catch (error) {
    if (filePath) {
      cleanUpFile(path.join("Homepage", path.basename(filePath)));
    }
    console.error("Facility creation error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const UpdateFacility = async (req, res) => {
    // Initialize file paths for cleanup
    let newFilePath = null;
    let oldFilePath = null;

    try {
        const { id } = req.params; // Facility ID from URL params
        const adminid = req.adminid; // Admin ID from auth middleware
        const { clinicname_en,clinicname_my,openinghr_en,openinghr_my,mapurl,address_en,address_my } = req.body; // Required fields from request body

        // Handle new uploaded file if exists
        if (req.file) {
            newFilePath = path.basename(req.file.path);
        }

        /* ====================== */
        /* 1. ADMIN VERIFICATION  */
        /* ====================== */
        const adminVerified = await verifyAdmin(adminid);
        if (!adminVerified) {
            if (newFilePath) {
                const filename = path.basename(newFilePath);
                const todeletePath = path.join("Homepage", filename);
                cleanUpFile(todeletePath);
            }
            return res.status(403).json({
                success: false,
                message: "Unauthorized to update facility! Login first!"
            });
        }
        /* 2. REQUIRED FIELD CHECK */
        const requiredFields = {clinicname_en,clinicname_my,openinghr_en,openinghr_my,mapurl,address_en,address_my};
        const missingFields = Object.entries(requiredFields)
            .filter(([_, value]) => !value)
            .map(([key]) => key);

        if (missingFields.length > 0) {
            if (newFilePath) {
                const filename = path.basename(newFilePath);
                const todeletePath = path.join("Homepage", filename);
                cleanUpFile(todeletePath);
            }
            return res.status(400).json({
                success: false,
                message: "Fields required!",
                missingFields,
            });
        }

        /* ====================== */
        /* 3. EXISTING FACILITY CHECK */
        /* ====================== */
        const existingFacility = await facilitiesCollection.findById(id);
        if (!existingFacility) {
            if (newFilePath) {
                const filename = path.basename(newFilePath);
                const todeletePath = path.join("Homepage", filename);
                cleanUpFile(todeletePath);
            }
            return res.status(404).json({
                success: false,
                message: "No facility exists with the provided ID!"
            });
        }

        /* ====================== */
        /* 4. ADMIN PERMISSION CHECK */
        /* ====================== */
        if (!existingFacility.admins.includes(adminid)) {
            if (newFilePath) {
                const filename = path.basename(newFilePath);
                const todeletePath = path.join("Homepage", filename);
                cleanUpFile(todeletePath);
            }
            return res.status(403).json({
                success: false,
                message: "Unauthorized! You don't have permission to update this facility!",
            });
        }

        /* ====================== */
        /* 5. STORE OLD FILE PATH */
        /* ====================== */
        if (existingFacility.photo) {
            oldFilePath = path.join(__dirname, "..", "..", existingFacility.photo);
        }

        /* ====================== */
        /* 6. PREPARE UPDATE DATA */
        /* ====================== */
        const updateData = {
            clinicname_en,
            clinicname_my,
            openinghr_en,
            openinghr_my,
            address_en,
            address_my,
            mapurl,
            ...(req.file && { photo: `/public/Homepage/${req.file.filename}` }),
            updatedAt: Date.now()
        };

        /* ====================== */
        /* 7. PERFORM THE UPDATE */
        /* ====================== */
        const updatedFacility = await facilitiesCollection.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedFacility) {
            if (newFilePath) {
                const filename = path.basename(newFilePath);
                const todeletePath = path.join("Homepage", filename);
                cleanUpFile(todeletePath);
            }
            throw new Error("Failed to update the facility!");
        }

        /* ====================== */
        /* 8. CLEANUP OLD FILE */
        /* ====================== */
        if (req.file && oldFilePath) {
            const filename = path.basename(oldFilePath);
            const todeletePath = path.join("Homepage", filename);
            cleanUpFile(todeletePath);
        }

        /* ====================== */
        /* 9. SUCCESS RESPONSE */
        /* ====================== */
        return res.status(200).json({
            success: true,
            message: "Facility updated successfully!",
            facility: updatedFacility
        });

    } catch (error) {
        /* ====================== */
        /* 10. ERROR HANDLING */
        /* ====================== */
        if (req.file) {
            const filename = path.basename(req.file.path);
            const todeletePath = path.join("Homepage", filename);
            cleanUpFile(todeletePath);
        }

        console.error("Facility update error:", error);
        
        return res.status(500).json({
            success: false,
            message: "Internal server error!",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};

export const GetAllFacilities = async (req, res) => {
    try {
        const { lang } = req.query;
        let projection = {
            photo: 1,
            mapurl: 1,
            admins: 1,
        };

        /* Configure Language */
        if (lang === "my" || lang === "en") {
            projection[`clinicname_${lang}`] = 1;
            projection[`openinghr_${lang}`] = 1;
            projection[`address_${lang}`] = 1;
        } else if (lang === undefined) {
            projection["clinicname_en"] = 1;
            projection["clinicname_my"] = 1;
            projection["openinghr_en"] = 1;
            projection["openinghr_my"] = 1;
            projection["address_en"] = 1;
            projection["address_my"] = 1;
        }

        const facilities = await facilitiesCollection.find({}, projection).sort({ createdAt: 1 });

        // Format the response to remove _en/_my suffixes and keep only generic fields
        const formattedFacilities = facilities.map(facility => {
            const facilityObj = facility.toObject();
            
            if (lang === "my" || lang === "en") {
                return {
                    _id: facilityObj._id,
                    clinicname: facilityObj[`clinicname_${lang}`],
                    openinghr: facilityObj[`openinghr_${lang}`],
                    address:facilityObj[`address_${lang}`],
                    photo: facilityObj.photo,
                    mapurl: facilityObj.mapurl,
                    admins: facilityObj.admins,
                };
            } else {
                // If no language is specified, return all fields (including _en and _my)
                return facilityObj;
            }
        });

        return res.status(200).json({
            success: true,
            count: formattedFacilities.length,
            facilities: formattedFacilities
        });
    } catch (error) {
        console.error("Get all facilities error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error!",
            error: process.env.NODE_ENV==="development" ? error.message : undefined,
        });
    }
};
/* Get Single*/
export const GetEachFacility = async (req, res) => {
    try {
        const { id } = req.params;
        /* ====================== */
        /* 2. FETCH FACILITY DATA */
        /* ====================== */
        const facility = await facilitiesCollection.findById(id);
        
        if (!facility) {
            return res.status(404).json({
                success: false,
                message: "Facility not found!"
            });
        }
        /* ====================== */
        /* 4. SUCCESS RESPONSE */
        /* ====================== */
        return res.status(200).json({
            success: true,
            facility
        });

    } catch (error) {
        console.error("Get facility error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error!",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};

/* Delete */
export const DeleteFacility = async (req, res) => {
    let filePath = null;
    
    try {
        const { id } = req.params;
        const adminid = req.adminid;

        /* ====================== */
        /* 1. ADMIN VERIFICATION  */
        /* ====================== */
        const adminVerified = await verifyAdmin(adminid);
        if (!adminVerified) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to delete facility! Login first!"
            });
        }

        /* ====================== */
        /* 2. FIND EXISTING FACILITY */
        /* ====================== */
        const existingFacility = await facilitiesCollection.findById(id);
        
        if (!existingFacility) {
            return res.status(404).json({
                success: false,
                message: "Facility not found!"
            });
        }

        /* ====================== */
        /* 3. ADMIN PERMISSION CHECK */
        /* ====================== */
        if (!existingFacility.admins.includes(adminid)) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized! You don't have permission to delete this facility!"
            });
        }

        /* ====================== */
        /* 4. STORE FILE PATH FOR CLEANUP */
        /* ====================== */
        if (existingFacility.photo) {
            filePath = path.join(__dirname, "..", "..", existingFacility.photo);
        }

        /* ====================== */
        /* 5. PERFORM DELETION */
        /* ====================== */
        const deletedFacility = await facilitiesCollection.findByIdAndDelete(id);
        
        if (!deletedFacility) {
            throw new Error("Failed to delete facility!");
        }

        /* ====================== */
        /* 6. CLEANUP FACILITY IMAGE */
        /* ====================== */
        if (filePath) {
            const filename = path.basename(filePath);
            const todeletePath = path.join("Homepage", filename);
            cleanUpFile(todeletePath);
        }

        /* ====================== */
        /* 7. SUCCESS RESPONSE */
        /* ====================== */
        return res.status(200).json({
            success: true,
            message: "Facility deleted successfully!"
        });

    } catch (error) {
        console.error("Delete facility error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error!",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
};
