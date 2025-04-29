import { Router } from "express";
import { create,getAllMissions,updateMission,deleteMission} from "../../controllers/Aboutus/aboutusmission.js";
import { checkAuthMiddleware } from "../../middleware/adminauth.js";
const AboutMissionRoute = Router()

AboutMissionRoute.post("/aboutmission",checkAuthMiddleware,create)
AboutMissionRoute.get("/aboutmission",getAllMissions);
AboutMissionRoute.put("/aboutmission/:id",checkAuthMiddleware,updateMission)
AboutMissionRoute.delete("/aboutmission/:id",checkAuthMiddleware,deleteMission)
export default AboutMissionRoute;