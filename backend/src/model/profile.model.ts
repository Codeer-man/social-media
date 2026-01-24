import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      min: 3,
    },
    userName: {
      type: String,
      min: 3,
      unique: true,
      required: true,
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
      default: undefined,
    },
    website: {
      type: String,
    },
    accoutnType: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    followers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    followersCount: {
      type: Number,
      default: 0,
    },
    followingCount: {
      type: Number,
      default: 0,
    },
    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true },
);

export const Profile = mongoose.model("Profile", profileSchema);
