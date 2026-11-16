import mongoose from "mongoose";
import fileMetadataSchema from "./FileMetadata.js";
import { ROLES } from "../constants/index.js";


const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  documents: {
    type: [fileMetadataSchema],
    default: []
  },
  role: {
    type: String,
    enum: Object.values(ROLES),
    default: ROLES.USER
  }
});

export default mongoose.model("User", userSchema);
