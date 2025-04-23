import { Router } from "express";
import { signup,SignUpVerify } from "../controllers/admin.js";
const adminRoutes = Router();

adminRoutes.post("/signup",signup);
adminRoutes.post("/signupverify",SignUpVerify)

export default adminRoutes;