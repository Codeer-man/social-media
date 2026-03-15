import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../lib/token";
import { User } from "../model/user.model";
import { Profile } from "../model/profile.model";

export default async function authRequired(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies.accessToken as string;

  if (!token) {
    return res.status(401).json({ message: "token is requried" });
  }

  try {
    const payload = verifyAccessToken(token);

    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return res.status(401).json({
        message: "Token version invalid",
      });
    }
    const profile = await Profile.findOne({ userId: user._id });

    const authReq = req as any;

    authReq.user = {
      id: user.id,
      profile: profile?._id.toString() || undefined,
      email: user.email,
      tokenVersion: user.tokenVersion,
      isEmailVerified: user.isEmailVerified,
      role: user.role,
    };

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Invalid server error",
      error: error,
    });
  }
}
