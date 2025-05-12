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
import usermessageRouter from "./routes/Contactus/usermessage.js";
import FacilityRouter from "./routes/Homepage/facilities.js";
import ServicesRoutes from "./routes/Services/services.js";
import HomepageBannerRoutes from "./routes/Homepage/homepagebanner.js";
import TestimonalRouter from "./routes/Homepage/testimonals.js";
import servicesCollection from "./models/OurServices/services.js";
import ServiceDataRouter from "./routes/Services/servicedata.js";
const server = express()

/* Cors */
// Allow requests from your production frontend
const allowedOrigins = [
    'http://localhost:5173',
    'https://nae-thit-dashboard-7ghi.vercel.app',
    "https://nae-thit-admin.vercel.app",
    "https://www.naethit.com"
  ];

  server.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // If you're sending cookies or auth headers
  }));
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
server.use("/api/pages",GalleryRoutes);
server.use("/api/pages",BlogRouter);
server.use("/api/pages",AboutBannerRouter)
server.use("/api/pages",AboutMissionRoute)
server.use("/api/pages",TeamMemberRouters);
server.use("/api/pages",usermessageRouter);
server.use("/api/pages",ServicesRoutes);
server.use("/api/pages",HomepageBannerRoutes);
server.use("/api/pages",TestimonalRouter);
server.use("/api/pages",ServiceDataRouter);
/* Home Page */
server.use("/api/pages",FacilityRouter)
server.listen(process.env.PORT,()=>{
    connectDB()
    console.log("The server is connected to port",process.env.PORT)
})

