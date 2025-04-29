import fs from "fs";
const cleanUpFile = (filePath)=>{
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error("Error cleaning up file:", err);
      }
    }
  }

  export default cleanUpFile;