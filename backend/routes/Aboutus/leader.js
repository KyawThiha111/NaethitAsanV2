import {Router} from "express";
import { CreateLeader,updateLeader,GetAllLeaders,GetSingleLeader,deleteLeader} from "../../controllers/Aboutus/leader.js";
import { checkAuthMiddleware } from "../../middleware/adminauth.js";
import { uploadLeader } from "../../middleware/multer.js";
const LeaderRouters = Router();

LeaderRouters.post("/leaders",checkAuthMiddleware,uploadLeader.single("photo"),CreateLeader)
LeaderRouters.put("/leaders/:leaderid",checkAuthMiddleware,uploadLeader.single("photo"),updateLeader)
LeaderRouters.get("/leaders",GetAllLeaders);
LeaderRouters.get("/leaders/:id",GetSingleLeader)
LeaderRouters.delete("/leaders/:memberid",checkAuthMiddleware,deleteLeader)
export default LeaderRouters;