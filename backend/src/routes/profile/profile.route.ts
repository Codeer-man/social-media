import express from "express";
import {
  createProfileHandler,
  getDataHandler,
  updateProfileHandler,
} from "../../controller/profile/profile.controller";
import authRequired from "../../middleware/authRequire";
import {
  addFollowerHandler,
  blockUserHandler,
  fetchUserHandler,
  removeFollowerHanlder,
  unBlockUserHandler,
} from "../../controller/profile/follower.controller";

const router = express.Router();

router.get("/", authRequired, getDataHandler);
router.get("/:type", authRequired, fetchUserHandler);

router.post("/create", authRequired, createProfileHandler);
router.patch("/update", authRequired, updateProfileHandler);

// follower
router.patch("/follow/:userName", authRequired, addFollowerHandler);
router.patch("/unfollow/:userName", authRequired, removeFollowerHanlder);

//block user
router.patch("/blockUser/:userName", authRequired, blockUserHandler);
router.patch("/unBlockUser/:userName", authRequired, unBlockUserHandler);

export default router;
