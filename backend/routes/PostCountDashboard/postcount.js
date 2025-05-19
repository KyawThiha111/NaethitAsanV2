import { Router } from "express";
import { GetPostCount } from "../../controllers/PostCountDashboard/postcount.js";
const PostCountRouter = Router();

PostCountRouter.get("/postcounts",GetPostCount);

export default PostCountRouter;
