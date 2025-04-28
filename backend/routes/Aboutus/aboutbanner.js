import {Router} from "express"
import { UpdateAboutBanner,GetAboutBanner } from "../../controllers/Aboutus/aboutbanner.js";
import { checkAuthMiddleware } from "../../middleware/adminauth.js";
import { uploadAboutus } from "../../middleware/multer.js";
const AboutBannerRouter = Router();

AboutBannerRouter.put("/aboutbanner",checkAuthMiddleware,uploadAboutus,UpdateAboutBanner)
AboutBannerRouter.get("/aboutbanner",GetAboutBanner)
export default AboutBannerRouter;