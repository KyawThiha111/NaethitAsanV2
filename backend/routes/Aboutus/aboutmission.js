import { Router } from "express";
import { create,getAllMissions,getEachMission,updateMission,deleteMission} from "../../controllers/Aboutus/aboutusmission.js";
import { checkAuthMiddleware } from "../../middleware/adminauth.js";
const AboutMissionRoute = Router()

AboutMissionRoute.post("/aboutmission",checkAuthMiddleware,create)
AboutMissionRoute.get("/aboutmission",getAllMissions);
AboutMissionRoute.get("/aboutmission/:id",getEachMission);
AboutMissionRoute.put("/aboutmission/:id",checkAuthMiddleware,updateMission)
AboutMissionRoute.delete("/aboutmission/:id",checkAuthMiddleware,deleteMission)
export default AboutMissionRoute;