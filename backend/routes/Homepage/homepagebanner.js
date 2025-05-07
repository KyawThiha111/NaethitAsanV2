import { uploadHomepageBanner } from "../../middleware/multer.js";
import { Router } from "express";
import { checkAuthMiddleware } from "../../middleware/adminauth.js";
import { verifyAdmin } from "../../utils/adminverify.js";
import { UpdateHomeBanner,GetHomeBanner } from "../../controllers/Homepage/homepagebanner.js";
const HomepageBannerRoutes = Router();

HomepageBannerRoutes.put("/homepagebanner",checkAuthMiddleware,uploadHomepageBanner.single("homepage_banner_bg"),UpdateHomeBanner);
HomepageBannerRoutes.get("/homepagebanner",GetHomeBanner)
export default HomepageBannerRoutes;