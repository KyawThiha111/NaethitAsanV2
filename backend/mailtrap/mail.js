import { VERIFICATION_EMAIL_TEMPLATE,LOGIN_VERIFY_EMAIL_TEMPLATE,Login_EMAIL_TEMPLATE,PASSWORD_RESET_REQUEST_TEMPLATE,PASSWORD_RESET_SUCCESS_TEMPLATE } from "../mailtrap/mailtemplates.js";
import { transport,sender } from "./mailconfig.js";
import nodemailer from "nodemailer";

export const verifySignupEmail = async(email,token)=>{
    const recipient = email;
    try {
       const response = await transport.sendMail({
        from:sender,
        to:recipient,
        subject:"Verify your account with the token below!",
        html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",token),
        catagory:"Email Verification!"
       })
       console.log("Email sent successfully",response);
       console.log('Preview URL: %s', nodemailer.getTestMessageUrl(response));
    } catch (error) {
        console.log("Sending verification error!")
    }
}

export const welcomeEmail = async(email,name,position)=>{
   const recipient = email;
   try {
    const response = await transport.sendMail({
        from:sender,
        to:recipient,
        subject:"Logged in notification!",
        html:Login_EMAIL_TEMPLATE.replaceAll("{position}",position).replace("{name}",name),
        catagory:"Loggin Noti!"
    })
    console.log("Email sent successfully",response);
   } catch (error) {
    console.log("Sending verification error!")
   }
}

export const verifyLoginEmail = async(email,loginToken)=>{
    const recipient = email;
    try {
       const response = await transport.sendMail({
        from:sender,
        to:recipient,
        subject:"Verify your account with the login token below!",
        html:LOGIN_VERIFY_EMAIL_TEMPLATE.replace("{verificationCode}",loginToken),
        catagory:"Email Verification!"
       })
       console.log("Email sent successfully",response);
       console.log('Preview URL: %s', nodemailer.getTestMessageUrl(response));
    } catch (error) {
        console.log("Sending verification error!")
    }
}