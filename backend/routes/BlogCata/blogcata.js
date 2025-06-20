import { Router } from "express";
import { checkAuthMiddleware } from "../../middleware/adminauth.js";
import { CreateCata, GetAllCata } from "../../controllers/BlogCata/blogcata.js";
const CataRouter = Router();

CataRouter.post("/blogcatagory",checkAuthMiddleware,CreateCata)
CataRouter.get("/blogcatagory",GetAllCata)
export default CataRouter;