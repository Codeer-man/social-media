import express from "express";
import {
  createProfileHandler,
  updateProfileHandler,
} from "../../controller/profile/profile.controller";
import authRequired from "../../middleware/authRequire";
import {
  addFollowerHandler,
  removeFollowerHanlder,
} from "../../controller/profile/follower.controller";

const router = express.Router();

router.post("/create", authRequired, createProfileHandler);
router.patch("/update", authRequired, updateProfileHandler);

// follower
router.patch("/follow/:userName", authRequired, addFollowerHandler);
router.patch("/unfollow/:userName", authRequired, removeFollowerHanlder);

export default router;
