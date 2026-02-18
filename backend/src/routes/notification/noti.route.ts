import express from "express";
import authRequired from "../../middleware/authRequire";
import {
  deleteAllNotificationHandler,
  deleteReadNotificationHandler,
  getNotificationController,
  readNotificationHandler,
} from "../../controller/notification/notification.controller";

const router = express.Router();

router.get("/", authRequired, getNotificationController);
router.patch("/:notiId", authRequired, readNotificationHandler);
router.delete("/delete/read", authRequired, deleteReadNotificationHandler);
router.delete("/delete/all", authRequired, deleteAllNotificationHandler);

export default router;
