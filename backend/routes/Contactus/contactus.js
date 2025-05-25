import { Router } from "express";
import { EditContactData,getContactData } from "../../controllers/Contactus/contactus.js";
import { checkAuthMiddleware } from "../../middleware/adminauth.js";
const ContactUsRouter = Router();

ContactUsRouter.put("/contactdata",checkAuthMiddleware,EditContactData)
ContactUsRouter.get("/contactdata",getContactData)
export default ContactUsRouter;