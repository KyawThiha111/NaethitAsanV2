import { uploadBlog } from "../middleware/multer.js";
import { Router } from "express";
const BlogRouter = Router();
import { CreateBlog,UpdateBlogPost,GetAllBlog,DeleteBlog } from "../controllers/blog.js";
import { checkAuthMiddleware } from "../middleware/adminauth.js";
BlogRouter.post("/blog",checkAuthMiddleware,uploadBlog.single("img"),CreateBlog)
BlogRouter.put("/blog/:blogid",checkAuthMiddleware,uploadBlog.single("img"),UpdateBlogPost)
BlogRouter.get("/blog",GetAllBlog)
BlogRouter.delete("/blog/:blogid",checkAuthMiddleware,DeleteBlog)
export default BlogRouter;