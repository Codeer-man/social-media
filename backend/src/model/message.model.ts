import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: String,
      required: true,
      ref: "Profile",
      index: true,
    },
    receiverId: {
      type: String,
      required: true,
      ref: "Profile",
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text",
    },
    attachment: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["sent", "seen"],
      default: "sent",
    },
  },
  { timestamps: true },
);

messageSchema.index({ senderId: 1, receiverId: 1 });

export const Message = mongoose.model("Message", messageSchema);
