import multer from "multer";
import path from "path";
import fs from "fs"
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/* File Filter for image only */
const imageFilter = (req,file,cb)=>{{
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
 const ext = path.extname(file.originalname).toLowerCase();
 // Allow jfif files even if mimetype is octet-stream

  if(allowedTypes.includes(file.mimetype)||ext===".jfif"){
  cb(null,true)
  }else{
    cb(new Error('Only image files are allowed!'), false)
  }
}}
let destinatedfile = path.join(__dirname,"..","public")

  const getStorage = (uploadFolder) => {
    return multer.diskStorage({
      destination: function (req, file, cb) {
        const destPath = path.join(destinatedfile, uploadFolder);
        
        // Ensure directory exists
        fs.mkdir(destPath, { recursive: true }, (err) => {
          if (err) return cb(err);
          cb(null, destPath);
        });
      },
      filename: function (req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        let uniqueSuffix;
        
        // Normalize all jpeg variants to .jpg
        if (ext === '.jfif' || ext === '.jpe' || file.mimetype === 'image/jpeg') {
          uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.jpg';
        } else {
          uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
        }
        
        cb(null, file.fieldname + '-' + uniqueSuffix);
      }
    });
  };
  
 export const upLoadGallery = multer({ storage: getStorage("Gallery"),fileFilter:imageFilter,limits:{fileSize:5*1024*1024}})// 5 MB limit
 export const uploadBlog = multer({storage:getStorage("Blog"),fileFilter:imageFilter,limits:{fileSize:5*1024*1024}})
 export const uploadAboutus = multer({storage:getStorage("Aboutus"),fileFilter:imageFilter,limits:{fileSize:5*1024*1024}})