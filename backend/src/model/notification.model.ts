import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    receipt: {
      // who will receive
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    //from whom it came
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "STORY_REACTION",
        "FOLLOWED",
        "POST_COMMENT",
        "POST_LIKE",
        "COMMENT_LIKE",
        "COMMENT_REPLY",
      ],
      required: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "entityModel",
    },

    entityModel: {
      type: String,
      enum: ["Post", "Comment", "Story", "Profile"],
    },

    message: {
      type: String,
      default: "",
    },
    // Seen or not
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Notification = mongoose.model("Notification", notificationSchema);
