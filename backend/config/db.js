import mongoose from "mongoose";
import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({
    path:path.join(__dirname,"../.env")
})

let MongoUrl="";
const connectDB = async()=>{
    if(process.env.MONGO_URI){
        MongoUrl=process.env.MONGO_URI
    }
    try {
        const dbResponse = await mongoose.connect(MongoUrl);
        console.log("Successfully connected to ",dbResponse.connection.host)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

export default connectDB;
