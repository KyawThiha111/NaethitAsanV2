import adminCollection from "../models/admin.js";
import AboutUsBannerCollection from "../models/AboutUs/aboutbanner.js";
import AbouUsMissionCollection from "../models/AboutUs/aboutusmission.js";
import BlogCollection from "../models/blog.js";
import TeamMemberCollection from "../models/AboutUs/teammember.js";
import UserMessageCollection from "../models/ContactUs/usermessage.js";
import facilitiesCollection from "../models/HomePage/facilities.js";
import HomepagebannerCollection from "../models/HomePage/banner.js";
import servicesCollection from "../models/OurServices/services.js";
import servicepageDataCollection from "../models/OurServices/pagedata.js";
import ContactusCollection from "../models/ContactUs/contactus.js";
import CataSchema from "../models/BlogCata/blogcata.js";
//create functions
import addAdminToCollectionWhileSignUp from "../utils/signupcollectionupdate.js";
import bcryptjs from "bcryptjs"
import { verifySignupEmail,welcomeEmail,verifyLoginEmail } from "../mailtrap/mail.js";
import generateAccessTokenAndSetCookie from "../utils/geneateTokenAndSetCookie.js";
export const signup = async(req,res)=>{
     const {adminname,email,password,position} = req.body;
     if(!adminname||!email||!password){
        return res.status(400).json({success:false,message:"Fileds required!"})
     }
    try {
        const adminalreadyexist = await adminCollection.findOne({$or:[{adminname},{email}]});
     if(adminalreadyexist){
        return res.status(400).json({success:false,message:"Admin with these fileds already exist!"})
     } 
     const hashedpassword = await bcryptjs.hash(password,10)
     const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
     let signupAdmin;
     if(req.body.position){
         signupAdmin = await adminCollection.create({adminname,email,password:hashedpassword,position,verificationToken,verificationTokenExpiresAt:Date.now()+24*60*60*1000})
     }else{
        signupAdmin = await adminCollection.create({adminname,email,password:hashedpassword,verificationToken,verificationTokenExpiresAt:Date.now()+24*60*60*1000})
     }
     await verifySignupEmail(email,verificationToken)
     return res.status(201).json({success:true,message:"Admin signed up!",admin:{...signupAdmin._doc,password:undefined}})
    } catch (error) {
        console.log(error)
     return res.status(500).json({success:false,message:"An error occured while creating a new account!"})
    }

}

export const SignUpVerify = async (req, res) => {
    const { tokencode } = req.body;
    const dashboardURL = "http://localhost:5173/dashboard";
    
    try {
        if (!tokencode) {
            return res.status(400).json({ success: false, message: "Field required!" });
        }

        // Find the verifying admin
        const adminExisting = await adminCollection.findOne({
            verificationToken: tokencode,
            verificationTokenExpiresAt: { $gt: Date.now() }
        });

        if (!adminExisting) {
            return res.status(404).json({ 
                success: false, 
                message: "Invalid or expired verification code" 
            });
        }

        // Update admin verification status
        adminExisting.isVerified = true;
        adminExisting.verificationToken = undefined;
        adminExisting.verificationTokenExpiresAt = undefined;
        await adminExisting.save();

        // Set cookie and generate token
        const loginToken = generateAccessTokenAndSetCookie(res, adminExisting._id, adminExisting.position);

        // Send welcome email
        await welcomeEmail(adminExisting.email, adminExisting.adminname, adminExisting.position);

        // Handle About Us banner document creation/update
    let aboutUsBanner = await AboutUsBannerCollection.findOne({});
        if (!aboutUsBanner) {
            const adminscount = await adminCollection.countDocuments();
            if(adminscount>0){
            const getalladmins = await adminCollection.find({},"_id");
            const alladminids = getalladmins.map((admin)=>admin._id);
            // First admin - create new document with default values
            aboutUsBanner = await AboutUsBannerCollection.create({
                admins:alladminids,
            });
        }
        } else {
            // Subsequent admins - add to existing document if not already present
            if (!aboutUsBanner.admins.includes(adminExisting._id)) {
                aboutUsBanner.admins.push(adminExisting._id);
                await aboutUsBanner.save();
            }
        }
    /* Contact us creation or Update */
    let ContactUsData = await ContactusCollection.findOne({});
    if(!ContactUsData){
        const adminscount = await adminCollection.countDocuments();
        if(adminscount&&adminscount>0){
            const getalladmins = await adminCollection.find({},"_id");
            const alladminids = getalladmins.map((admin)=>admin._id);
            ContactUsData = await ContactusCollection.create({admins:alladminids})
        }
    }else{
        if(!ContactUsData.admins.includes(adminExisting._id)){
            ContactUsData.admins.push(adminExisting._id);
            await ContactUsData.save()
        }
    }
        // Handle Home Page Banner document creation/update
    let homepageBanner = await HomepagebannerCollection.findOne({});
        if (!homepageBanner) {
            const adminscount = await adminCollection.countDocuments();
            if(adminscount>0){
            const getalladmins = await adminCollection.find({},"_id");
            const alladminids = getalladmins.map((admin)=>admin._id);
            // First admin - create new document with default values
            homepageBanner = await HomepagebannerCollection.create({
                admins:alladminids,
            });
        }
        } else {
            // Subsequent admins - add to existing document if not already present
            if (!homepageBanner.admins.includes(adminExisting._id)) {
                homepageBanner.admins.push(adminExisting._id);
                await homepageBanner.save();
            }
        }
        // Handle Service Banner Data document creation/update
    let serviceBanner = await servicepageDataCollection.findOne({});
        if (!serviceBanner) {
            const adminscount = await adminCollection.countDocuments();
            if(adminscount>0){
            const getalladmins = await adminCollection.find({},"_id");
            const alladminids = getalladmins.map((admin)=>admin._id);
            // First admin - create new document with default values
            serviceBanner = await servicepageDataCollection.create({
                admins:alladminids,
            });
        }
        } else {
            // Subsequent admins - add to existing document if not already present
            if (!serviceBanner.admins.includes(adminExisting._id)) {
                serviceBanner.admins.push(adminExisting._id);
                await serviceBanner.save();
            }
        }
       /* Update admins to collection*/
       //1.Aboutusmission
       const aboutusmissioncount = await AbouUsMissionCollection.countDocuments();
       if(aboutusmissioncount>0){
        await addAdminToCollectionWhileSignUp(adminExisting._id,AbouUsMissionCollection)
       } 
       //2.Blogs
       const blogcount = await BlogCollection.countDocuments();
       if(blogcount>0){
        await addAdminToCollectionWhileSignUp(adminExisting._id,BlogCollection)
       }
       //3. Team Member 
       const memberCount = await TeamMemberCollection.countDocuments();
       if(memberCount>0){
        await addAdminToCollectionWhileSignUp(adminExisting._id,TeamMemberCollection)
       }
       /* Cata Blog */
       const BlogCataCount = await CataSchema.countDocuments();
       if(BlogCataCount>0){
        await addAdminToCollectionWhileSignUp(adminExisting._id,CataSchema)
       }
       /* 4.User Message */
       const userMessageCount = await UserMessageCollection.countDocuments();
       if(userMessageCount>0){
        await addAdminToCollectionWhileSignUp(adminExisting._id,UserMessageCollection)
       }
       /* 5.Facilities Message */
       const facilitiesCount = await facilitiesCollection.countDocuments();
       if(facilitiesCount>0){
        await addAdminToCollectionWhileSignUp(adminExisting._id,facilitiesCollection)
       }
       /* Services*/
       const serviceCount = await servicesCollection.countDocuments();
       if(serviceCount>0){
        await addAdminToCollectionWhileSignUp(adminExisting._id,servicesCollection)
       }
        return res.status(200).json({
            success: true,
            message: `Logged in as ${adminExisting.position}`,
            loginToken: loginToken
        });

    } catch (error) {
        console.error("SignUpVerify error:", error);
        return res.status(500).json({
            success: false,
            error: process.env.NODE_ENV === "development" ? error.message : undefined
        });
    }
};

/* Login */
/* Previously use 2 FA in Commit V6 */
/* export const loginForm = async (req, res) => {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: "Email and password are required" 
        });
    }

    try {
        // Find admin by email (case insensitive)
        const admin = await adminCollection.findOne({ 
            email: email 
        });

        // Check if admin exists
        if (!admin) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" // Generic message for security
            });
        }

        // Verify password
        const isPasswordValid = await bcryptjs.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }
        admin.isVerified=true;
        await admin.save();
        const loginToken = generateAccessTokenAndSetCookie(res,admin._id,admin.position);

        return res.status(200).json({ 
            success: true, 
            message: "User are successfully logged in!",
            loginToken:loginToken
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "An error occurred during login" 
        });
    }
}; */
export const loginForm = async (req, res) => {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: "Email and password are required" 
        });
    }

    try {
        // Find admin by email (case insensitive)
        const admin = await adminCollection.findOne({ 
            email: email 
        });

        // Check if admin exists
        if (!admin) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" // Generic message for security
            });
        }

        // Verify password
        const isPasswordValid = await bcryptjs.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        // Generate 6-digit verification code
        const loginVerificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const tokenExpiration = new Date(Date.now() + 15 * 60 * 1000); // 1 hr expiry

        // Save verification token
        admin.loginVerificationToken = loginVerificationToken;
        admin.loginVerificationTokenExpiresAt = tokenExpiration;
        await admin.save();

        // Send verification email
        await verifyLoginEmail(admin.email, loginVerificationToken);

        return res.status(200).json({ 
            success: true, 
            message: "Verification code sent to your email",
            data: {
                email: admin.email,
                requires2FA: true
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "An error occurred during login" 
        });
    }
};

/* Add Login Token Post Route */
 export const loginTokenForm = async(req,res)=>{
   const {tokencode} = req.body;
   const dashboardURL = "http://localhost:5173/dashboard";
   try {
      if(!tokencode){
         return res.status(400).json({success:false,message:"Field required!"})
      }
      const adminExisting = await adminCollection.findOne({loginVerificationToken:tokencode,loginVerificationTokenExpiresAt:{$gt:Date.now()}})
      if (!adminExisting) {
			return res.status(404).json({ success: false, message: "Invalid or expired verification code" });
		}
      adminExisting.isVerified=true;
      adminExisting.loginVerificationToken=undefined;
      adminExisting.loginVerificationTokenExpiresAt=undefined;
      await adminExisting.save()
          
          const loginToken = generateAccessTokenAndSetCookie(res,adminExisting._id,adminExisting.position);
     
      await welcomeEmail(adminExisting.email,adminExisting.baseModelName,adminExisting.position)
     return res.status(200).json({success:true,message:`Logged in as an ${adminExisting.position}`,loginToken:loginToken})
   } catch (error) {
      return res.status(500).json({success:false,error:error.message})
   }
}

/* Password Reset */
export const resetPasswordStep1 = async (req, res) => {
    const { email} = req.body;

    // Input validation
    if (!email) {
        return res.status(400).json({ 
            success: false, 
            message: "Email is required!" 
        });
    }

    try {
        // Find admin by email (case insensitive)
        const admin = await adminCollection.findOne({ 
            email: email 
        });

        // Check if admin exists
        if (!admin) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials! No admin with this email!" // Generic message for security
            });
        }
        // Generate 6-digit verification code
        const resetVerificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const tokenExpiration = new Date(Date.now() + 15 * 60 * 1000); // 1 hr expiry

        // Save verification token
        admin.loginVerificationToken = resetVerificationToken;
        admin.loginVerificationTokenExpiresAt = tokenExpiration;
        await admin.save();

        // Send verification email
        await verifyLoginEmail(admin.email, resetVerificationToken);

        return res.status(200).json({ 
            success: true, 
            message: "Verification code sent to your email",
            data: {
                email: admin.email,
                requires2FA: true
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "An error occurred." 
        });
    }
};
/* Password Reset 2 */
export const resetPasswordStep2 = async(req,res)=>{
    const {tokencode,newpassword,confirmpassword} = req.body;
    const dashboardURL = "http://localhost:5173/dashboard";
    try {
       if(!tokencode||!newpassword||!confirmpassword){
          return res.status(400).json({success:false,message:"Field required!"})
       }
       const adminExisting = await adminCollection.findOne({loginVerificationToken:tokencode,loginVerificationTokenExpiresAt:{$gt:Date.now()}})
       if (!adminExisting) {
             return res.status(404).json({ success: false, message: "Invalid or expired verification code" });
         }
        /* Password Becrypt */
        if(newpassword!==confirmpassword){
            return res.status(400).json({success:false, message:"New Password and Confirm password don't match!"})
        }
       const hashedpassword = await bcryptjs.hash(newpassword,10)
       adminExisting.password = hashedpassword
       adminExisting.isVerified=true;
       adminExisting.loginVerificationToken=undefined;
       adminExisting.loginVerificationTokenExpiresAt=undefined;
       await adminExisting.save()
           
       const loginToken = generateAccessTokenAndSetCookie(res,adminExisting._id,adminExisting.position);
      return res.status(200).json({success:true,message:`Reset the password && Logged in as an ${adminExisting.position}`,loginToken:loginToken})
    } catch (error) {
       return res.status(500).json({success:false,error:error.message})
    }
 }
/* Don't need */
export const logout = (req, res) => {
    res.clearCookie('adminToken');
    return res.status(200).json({ 
        success: true, 
        message: "Logged out successfully" 
    });
};

/* Get All Admin */
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await adminCollection
      .find({}, "-password -verificationToken -verificationTokenExpiresAt") // Exclude sensitive fields
      .sort({ createdAt: -1 }); // Optional: latest admins first

    return res.status(200).json({
      success: true,
      message: "All admins fetched successfully!",
      data: admins,
    });
  } catch (error) {
    console.error("Error fetching admins:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
