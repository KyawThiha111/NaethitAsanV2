import { Schema, model } from "mongoose";
import mongoose from "mongoose";

const LeaderSchema = new Schema({
  photo: {
    type: String,
  },
  name_en: {
    type: String,
    required: true,
    unique: true,
  },
  name_my: {
    type: String,
    required: true,
    unique: true,
  },
  position_en: {
    type: String,
    required: true,
  },
  position_my: {
    type: String,
    required: true,
  },
  admins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
      required: true,
    },
  ],
},{timestamps:true});

const LeaderCollection = model("ourleader",LeaderSchema);
export default LeaderCollection;