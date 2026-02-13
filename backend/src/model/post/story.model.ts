import mongoose from "mongoose";

export const storySchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Profile",
    },
    mediaType: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
    mediaUrl: {
      type: String,
      required: true,
    },
    mediaKey: {
      type: String,
      required: true,
    },
    visibility: {
      type: String,
      default: "followers",
    },
    view: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Profile",
        },
        emoji: {
          type: String,
          enum: ["❤️", "😂", "🔥", "😍"],
        },
      },
    ],
    reactions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Profile",
        },
        emoji: {
          type: String,
          enum: ["❤️", "😂", "🔥", "😍"],
        },
      },
    ],
  },
  { timestamps: true },
);

//! TTL
// storySchema.index(
//   { createdAt: 1 },
//   { expireAfterSeconds: 86400 }, // 24 hours
// );

export const Story = mongoose.model("Story", storySchema);
