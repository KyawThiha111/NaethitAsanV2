import { Schema, model } from "mongoose";
import mongoose from "mongoose";

const TeamMemberSchema = new Schema({
  memberphoto: {
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

const TeamMemberCollection = model("teammember",TeamMemberSchema);
export default TeamMemberCollection;