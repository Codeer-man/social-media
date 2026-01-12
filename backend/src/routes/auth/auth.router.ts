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
import {
  getGoogleAuthHandler,
  googleAuthCallbackHanlder,
} from "../../controller/auth/googleAuth.controller";

const router = express.Router();

router.post("/register", registerHanlder);
router.post("/login", loginHandler);
router.get("/verify-email", verifyEmailHandler);
router.get("/refresh-token", authRequired, refreshTokenHandler);
router.post("/logout", authRequired, logoutHandler);

//forget pwd
router.post("/forget-password", authRequired, forgetPasswordHandler);
router.post("/reset-password", resetPasswordHandler);

//google auth
router.post("/google", getGoogleAuthHandler);
router.get("/google/callback", googleAuthCallbackHanlder);
export default router;
