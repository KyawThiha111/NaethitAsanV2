import { Router } from "express";
import { getNotiCount,resetNotiCount } from "../../controllers/Contactus/notirequest.js";

const NotiCountRouter = Router();

NotiCountRouter.get("/noticount",getNotiCount);
NotiCountRouter.put("/noticount",resetNotiCount);

export default NotiCountRouter;