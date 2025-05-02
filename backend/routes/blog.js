import { uploadBlog } from "../middleware/multer.js";
import { Router } from "express";
const BlogRouter = Router();
import { CreateBlog,UpdateBlogPost,GetAllBlog,GetSingleBlog,GetBlogsByCategory,DeleteBlog,GetAllBlogsBothLanguages,GetSingleBlogForUpdate } from "../controllers/blog.js";
import { checkAuthMiddleware } from "../middleware/adminauth.js";
BlogRouter.post("/blog",checkAuthMiddleware,uploadBlog.single("img"),CreateBlog)
BlogRouter.put("/blog/:blogid",checkAuthMiddleware,uploadBlog.single("img"),UpdateBlogPost)
BlogRouter.get("/blog",GetAllBlog)
BlogRouter.get("/blog/:id",GetSingleBlog)
BlogRouter.get("/blogsoncata",GetBlogsByCategory)
BlogRouter.delete("/blog/:blogid",checkAuthMiddleware,DeleteBlog)
BlogRouter.get("/bloggetallupdate",GetAllBlogsBothLanguages)
BlogRouter.get("/bloggetsingleupdate/:id",GetSingleBlogForUpdate)
export default BlogRouter;