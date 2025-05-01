import { Router } from "express";
import { createUserMessage } from "../../controllers/Contactus/usermessage.js";

const usermessageRouter = Router()

usermessageRouter.post("/messageus",createUserMessage)

export default usermessageRouter;