import { uploadHomepageBanner } from "../../middleware/multer.js";
import { Router } from "express";
import { checkAuthMiddleware } from "../../middleware/adminauth.js";
import { verifyAdmin } from "../../utils/adminverify.js";
import { UpdateHomeBanner,GetHomeBanner } from "../../controllers/Homepage/homepagebanner.js";
const HomepageBannerRoutes = Router();

HomepageBannerRoutes.put("/homepagebanner",checkAuthMiddleware,uploadHomepageBanner.fields([{name:"homepage_banner_bg",maxCount:1},{name:"homepage_blog_img",maxCount:1}]),UpdateHomeBanner);
HomepageBannerRoutes.get("/homepagebanner",GetHomeBanner)
export default HomepageBannerRoutes;