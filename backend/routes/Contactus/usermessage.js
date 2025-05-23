import { Router } from "express";
import { createUserMessage, getUserMessage, deleteUserMessage} from "../../controllers/Contactus/usermessage.js";
import MessageLimiter from "../../middleware/messageLimiter.js";
const usermessageRouter = Router()
import { checkAuthMiddleware } from "../../middleware/adminauth.js";

usermessageRouter.post("/messageus",MessageLimiter,createUserMessage)
usermessageRouter.get("/getusermessages",checkAuthMiddleware, getUserMessage)
usermessageRouter.delete("/deleteusermessage/:postid",checkAuthMiddleware,deleteUserMessage)
export default usermessageRouter;