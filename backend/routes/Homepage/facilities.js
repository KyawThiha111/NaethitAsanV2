import { CreateFacility,UpdateFacility,GetAllFacilities,GetEachFacility,DeleteFacility } from "../../controllers/Homepage/facilities.js";
import { Router } from "express";
import { checkAuthMiddleware } from "../../middleware/adminauth.js";
import { uploadFacilities } from "../../middleware/multer.js";
const FacilityRouter = Router();
FacilityRouter.post("/facilities",checkAuthMiddleware,uploadFacilities.single("photo"),CreateFacility)
FacilityRouter.put("/facilities/:id",checkAuthMiddleware,uploadFacilities.single("photo"),UpdateFacility)
FacilityRouter.get("/facilities",GetAllFacilities)
FacilityRouter.get("/facilities/:id",GetEachFacility)
FacilityRouter.delete("/facilities/:id",checkAuthMiddleware,DeleteFacility)
export default FacilityRouter;