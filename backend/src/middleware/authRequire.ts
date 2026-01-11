import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../lib/token";
import { User } from "../model/user.model";

export default async function authRequired(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization as string;

  if (!authHeader || authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Auth header is required",
    });
  }

  const token = authHeader.split(" ")[1];

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

    const authReq = req as any;

    authReq.user = {
      id: user.id,
      email: user.email,
      tokenVersion: user.tokenVersion,
      isEmailVerified: user.isEmailVerified,
    };

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Invalid server error",
      error: error,
    });
  }
}
