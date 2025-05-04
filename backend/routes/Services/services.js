import { Router } from "express";
import { checkAuthMiddleware } from "../../middleware/adminauth.js";
import { uploadServices } from "../../middleware/multer.js";
import { CreateServices,UpdateService,GetServices, GetSingleService, DeleteService} from "../../controllers/Services/services.js";
const ServicesRoutes = Router();

ServicesRoutes.post("/services",checkAuthMiddleware,uploadServices,CreateServices)
ServicesRoutes.put("/services/:id",checkAuthMiddleware,uploadServices,UpdateService)
ServicesRoutes.get("/services",GetServices)
ServicesRoutes.get("/services/:id",GetSingleService)
ServicesRoutes.delete("/services/:id",checkAuthMiddleware,DeleteService)
export default ServicesRoutes