import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
import morgan from "morgan";
import cookieParser from "cookie-parser";
import ExpressMongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import xss from "xss-clean";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import cors from "cors";
import path from "path"
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* DB connect */
import connectDB from "./config/db.js";
/* Routes */
import adminRoutes from "./routes/admin.js"
import GalleryRoutes from "./routes/gallery.js";
import BlogRouter from "./routes/blog.js";
import AboutBannerRouter from "./routes/Aboutus/aboutbanner.js";
import AboutMissionRoute from "./routes/Aboutus/aboutmission.js";
import TeamMemberRouters from "./routes/Aboutus/teammember.js";
const server = express()

/* Cors */
server.use(cors({
    origin:"http://localhost:5173"
}))
dotenv.config({
    path:path.resolve(__dirname,".env")
})
/* Middlewares */
server.use(express.json())
server.use(express.urlencoded({extended:true}))
server.use("/public",express.static(path.join(__dirname,"public")))
//logout morgan http request during development
if(process.env.NODE_ENV==="development"){
    server.use(morgan("dev"))
}

server.use("/api/admin",adminRoutes);
server.use("/api/pages",GalleryRoutes)
server.use("/api/pages",BlogRouter)
server.use("/api/pages",AboutBannerRouter)
server.use("/api/pages",AboutMissionRoute)
server.use("/api/pages",TeamMemberRouters);
server.listen(process.env.PORT,()=>{
    connectDB()
    console.log("The server is connected to port",process.env.PORT)
})

