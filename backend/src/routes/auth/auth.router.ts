import express from "express";
import {
  forgetPasswordHandler,
  loginHandler,
  logoutHandler,
  refreshTokenHandler,
  registerHanlder,
  resetPasswordHandler,
  verifyEmailHandler,
} from "../../controller/auth/auth.controller";
import authRequired from "../../middleware/authRequire";
import { roleRequire } from "../../middleware/roleRequired";

const router = express.Router();

router.post("/register", registerHanlder);
router.post("/login", loginHandler);
router.get("/verfy-email", authRequired, roleRequire, verifyEmailHandler);
router.get("/refresh-token", authRequired, refreshTokenHandler);
router.get("logout", authRequired, roleRequire, logoutHandler);
router.post(
  "/forget-password",
  authRequired,
  roleRequire,
  forgetPasswordHandler
);
router.post("/reset-password", authRequired, roleRequire, resetPasswordHandler);

export default router;
