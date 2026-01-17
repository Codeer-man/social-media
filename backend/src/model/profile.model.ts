import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      unique: true,
    },
    name: {
      type: String,
      require: true,
      min: 3,
    },
    userName: {
      type: String,
      min: 3,
      unique: true,
      require: true,
    },
    profilePicture: {
      type: String,
      default: undefined,
    },
    bio: {
      type: String,
      max: 150,
    },
    phoneNo: {
      type: String,
      max: 10,
      default: undefined,
    },
    location: {
      type: String,
      defalut: undefined,
    },
    website: {
      type: String,
    },
    accoutnType: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
  },
  { timestamps: true }
);

export const Profile = mongoose.model("Profile", profileSchema);
