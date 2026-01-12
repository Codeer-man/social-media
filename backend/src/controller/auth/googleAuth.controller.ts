// package google-auth-library
import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { User } from "../../model/user.model";
import crypto from "crypto";
import { hashPassword } from "../../lib/hash";
import { createAccessToken, createRefreshToken } from "../../lib/token";

function getGoogleClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUrl = process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !clientSecret) {
    throw new Error("Google client id and secret is missing ");
  }

  return new OAuth2Client(clientId, clientSecret, redirectUrl);
}

export async function getGoogleAuthHandler(_req: Request, res: Response) {
  try {
    const client = getGoogleClient();

    const url = client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: ["openid", "email", "profile"],
    });

    return res.status(200).json({
      message: "google auth login",
      link: url,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
}

export async function googleAuthCallbackHanlder(req: Request, res: Response) {
  const code = req.query.code as string | undefined;

  if (!code) {
    return res.status(400).json({
      message: "Missing code in callback",
    });
  }

  try {
    const client = getGoogleClient();

    const { tokens } = await client.getToken(code);

    if (!tokens.id_token) {
      return res.status(401).json({
        message: "No google token is present",
      });
    }

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID as string,
    });

    const payload = ticket.getPayload();

    const email = payload?.email;
    const emailVerified = payload?.email_verified;

    if (!email || !emailVerified) {
      return res.status(409).json({
        message: "Email not found or email not verified",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      const randomPwd = crypto.randomBytes(16).toString("hex");

      const passwordHash = await hashPassword(randomPwd);

      user = await User.create({
        email: normalizedEmail,
        password: passwordHash,
        isEmailVerified: true,
        role: "user",
      });
    } else {
      if (!user.isEmailVerified) {
        user.isEmailVerified = true;
        await user.save();
      }
    }

    const accessToken = createAccessToken(
      user.id,
      user.role,
      user.tokenVersion
    );

    const refreshToken = createRefreshToken(user.id, user.tokenVersion);

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      maxAge: 7 * 14 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Google login successfully",
      accessToken: accessToken,
      user: {
        email: user.email,
        isEmailVerified: user.isEmailVerified,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error,
    });
  }
}
