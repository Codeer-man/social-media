import express from "express";
import authRequired from "../../middleware/authRequire";
import {
  getConversationHandler,
  listMessageHandler,
  markMessageReadHandler,
  sendMessageHandler,
} from "../../controller/chat/chat.controller";

const router = express.Router();

router.post("/send/:receiverId", authRequired, sendMessageHandler);
router.patch("/mark-read/:senderId", authRequired, markMessageReadHandler);
router.get("/message/:otherUserId", authRequired, listMessageHandler);
router.get("/conversation", authRequired, getConversationHandler);

export default router;
