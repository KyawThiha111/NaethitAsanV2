import { Router } from "express";
import { checkAuthMiddleware } from "../../middleware/adminauth.js";
import { CreateCata, GetAllCata, DeleteCata } from "../../controllers/BlogCata/blogcata.js";
const CataRouter = Router();

CataRouter.post("/blogcatagory",checkAuthMiddleware,CreateCata)
CataRouter.get("/blogcatagory",GetAllCata)
CataRouter.delete("/blogcatagory/:id",checkAuthMiddleware,DeleteCata)
export default CataRouter;