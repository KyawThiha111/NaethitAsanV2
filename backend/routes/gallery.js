import { Router } from "express";
const GalleryRoutes = Router();
import { AddGallery,UpdateGallery,AsanAddGallery} from "../controllers/gallery.js";
import { upLoadGallery} from "../middleware/multer.js";
import { checkAuthMiddleware } from "../middleware/adminauth.js";
GalleryRoutes.post("/gallery",checkAuthMiddleware,upLoadGallery.single("img"),AddGallery)
GalleryRoutes.put("/gallery/:id",checkAuthMiddleware,upLoadGallery.single("img"),UpdateGallery)
GalleryRoutes.post("/asan",checkAuthMiddleware,upLoadGallery.single("img"),AsanAddGallery)
export default GalleryRoutes;