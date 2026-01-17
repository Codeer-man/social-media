import express from "express";
import {
  createProfileHandler,
  updateProfileHandler,
} from "../../controller/profile/profile.controller";
import authRequired from "../../middleware/authRequire";

const router = express.Router();

router.post("/create", authRequired, createProfileHandler);
router.patch("/update", authRequired, updateProfileHandler);

export default router;
