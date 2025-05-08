import { Router } from "express";
import {createTestimonal} from "../../controllers/Homepage/testimonals.js"
import { checkAuthMiddleware } from "../../middleware/adminauth.js";

const TestimonalRouter = Router();

TestimonalRouter.post("/testimonals",checkAuthMiddleware,createTestimonal)

export default TestimonalRouter;