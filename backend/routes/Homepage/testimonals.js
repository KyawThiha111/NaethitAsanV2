import { Router } from "express";
import {createTestimonal,GetAllTestimonal,DeleteTestimonal} from "../../controllers/Homepage/testimonals.js"
import { checkAuthMiddleware } from "../../middleware/adminauth.js";

const TestimonalRouter = Router();

TestimonalRouter.post("/testimonals",checkAuthMiddleware,createTestimonal)
TestimonalRouter.get('/testimonals',GetAllTestimonal)
TestimonalRouter.delete("/testimonals/:id",checkAuthMiddleware,DeleteTestimonal)
export default TestimonalRouter;