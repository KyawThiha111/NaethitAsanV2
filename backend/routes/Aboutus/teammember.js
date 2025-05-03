import {Router} from "express";
import { create,updateTeamMember,GetAllMembers,GetSingleMember,deleteMember } from "../../controllers/Aboutus/teammember.js";
import { checkAuthMiddleware } from "../../middleware/adminauth.js";
import { uploadTeamMember } from "../../middleware/multer.js";
const TeamMemberRouters = Router();

TeamMemberRouters.post("/teammember",checkAuthMiddleware,uploadTeamMember.single('memberphoto'),create)
TeamMemberRouters.put("/teammember/:memberid",checkAuthMiddleware,uploadTeamMember.single('memberphoto'),updateTeamMember)
TeamMemberRouters.get("/teammember",GetAllMembers)
TeamMemberRouters.get("/teammember/:id",GetSingleMember);
TeamMemberRouters.delete("/teammember/:memberid",checkAuthMiddleware,deleteMember)
export default TeamMemberRouters;
