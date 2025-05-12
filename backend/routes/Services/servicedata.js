import { Router } from "express";
const ServiceDataRouter = Router();

import { EditServiceData,GetServiceData } from "../../controllers/Services/servicedata.js";
import { checkAuthMiddleware } from "../../middleware/adminauth.js";
import { uploadServiceData } from "../../middleware/multer.js";

ServiceDataRouter.put("/servicedata",checkAuthMiddleware,uploadServiceData,EditServiceData);
ServiceDataRouter.get("/servicedata",GetServiceData)
export default ServiceDataRouter;