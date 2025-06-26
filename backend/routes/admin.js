import { Router } from "express";
import { signup,SignUpVerify,loginForm,loginTokenForm,resetPasswordStep1,resetPasswordStep2,getAllAdmins,deleteAdmin } from "../controllers/admin.js";
import { checkAuthMiddleware } from "../middleware/adminauth.js";
const adminRoutes = Router();

adminRoutes.post("/signup",signup);
adminRoutes.post("/signupverify",SignUpVerify)
adminRoutes.post("/login",loginForm)
adminRoutes.post("/loginverify",loginTokenForm)

adminRoutes.post("/resetpasswordverify",resetPasswordStep1);
adminRoutes.post("/resetpassword",resetPasswordStep2)

adminRoutes.get("/getadmins",getAllAdmins);
adminRoutes.delete("/deleteadmin/:id",checkAuthMiddleware,deleteAdmin)
export default adminRoutes;