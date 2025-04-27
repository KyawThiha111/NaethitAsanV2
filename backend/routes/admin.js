import { Router } from "express";
import { signup,SignUpVerify,loginForm,loginTokenForm } from "../controllers/admin.js";
const adminRoutes = Router();

adminRoutes.post("/signup",signup);
adminRoutes.post("/signupverify",SignUpVerify)
adminRoutes.post("/login",loginForm)
adminRoutes.post("/loginverify",loginTokenForm)
export default adminRoutes;