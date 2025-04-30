/* import fs from "fs";
import path from "path"
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename);

const cleanUpFile = (filePath)=>{
  const publicFromHere = path.join(__dirname,"..","public")
  const filepathtodelete = path.join(publicFromHere,filePath)
    if (filePath && fs.existsSync(filepathtodelete)) {
      try {
        fs.unlinkSync(filepathtodelete);
      } catch (err) {
        console.error("Error cleaning up file:", err);
      }
    }
  }

  export default cleanUpFile; */

  import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cleanUpFile = (filePath) => {
  try {
    // Handle cases where filePath might be undefined/null
    if (!filePath) return;

    // Normalize the path to handle different OS path separators
    const normalizedPath = path.normalize(filePath);

    // Resolve the full absolute path
    const publicDir = path.join(__dirname, "..", "public");
    const absolutePath = path.isAbsolute(normalizedPath) 
      ? normalizedPath
      : path.join(publicDir, normalizedPath);

    // Verify the path is within the public directory for security
    if (!absolutePath.startsWith(publicDir)) {
      console.error("Attempted to delete file outside public directory:", absolutePath);
      return;
    }

    // Delete the file if it exists
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
      console.log("Successfully deleted:", absolutePath);
    } else {
      console.warn("File not found:", absolutePath);
    }
  } catch (err) {
    console.error("Error cleaning up file:", err);
  }
};

export default cleanUpFile;