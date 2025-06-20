import { Schema, model } from "mongoose";
import mongoose from "mongoose";

const BlogCataSchema = new Schema(
  {
    cata_name: {
      type: String,
      required: true,
      unique: true,
    },
    admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admin",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const CataSchema = model("blogcatagory",BlogCataSchema)
export default CataSchema;