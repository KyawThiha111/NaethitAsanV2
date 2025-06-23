import { Router } from "express";
import { signup,SignUpVerify,loginForm,loginTokenForm,resetPasswordStep1,resetPasswordStep2,getAllAdmins } from "../controllers/admin.js";
const adminRoutes = Router();

adminRoutes.post("/signup",signup);
adminRoutes.post("/signupverify",SignUpVerify)
adminRoutes.post("/login",loginForm)
adminRoutes.post("/loginverify",loginTokenForm)

adminRoutes.post("/resetpasswordverify",resetPasswordStep1);
adminRoutes.post("/resetpassword",resetPasswordStep2)

adminRoutes.get("/getadmins",getAllAdmins);
export default adminRoutes;