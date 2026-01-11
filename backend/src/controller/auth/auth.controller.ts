import { Request, Response } from "express";
import { loginSchame, registerSchema } from "./auth.schema";
import { User } from "../../model/user.model";
import { comparePwd, hashPassword } from "../../lib/hash";
import {
  createAccessToken,
  createRefreshToken,
  createVerifyToken,
  verifyRefreshToken,
  verifyToken,
} from "../../lib/token";
import crypto from "crypto";
import { sendEmail } from "../../lib/email";
import { resetPwdHTML } from "../../utils/resetPwdHtml";

function getUrl() {
  return process.env.APP_URL || `http://localhost:${process.env.PORT}`;
}

export async function registerHanlder(req: Request, res: Response) {
  try {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).jsonp({
        message: "Invalid data!",
        error: result.error.flatten(),
      });
    }

    const { email, password, confirmPassword } = result.data;

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists.Please try different email",
      });
    }

    const passwordHash = await hashPassword(password);

    const newlyCreatedUser = await User.create({
      email: normalizedEmail,
      password: passwordHash,
      userName: normalizedEmail,
      role: "user",
      isEmailVerified: false,
    });

    await newlyCreatedUser.save();

    //verify email

    const verifyToken = createVerifyToken(newlyCreatedUser.id);

    const verifyUrl = `${getUrl}/api/auth/verify-email?token=${verifyToken}`;

    await sendEmail(
      newlyCreatedUser.email!,
      "verify your Email",
      `
      <p>Pleaes verify your email </p>
      <p><a href="${verifyUrl}"> ${verifyUrl} <a/> <p/>
      `
    );

    return res.status(200).json({
      message: "New User successfully created",
      user: {
        id: newlyCreatedUser.id,
        email: newlyCreatedUser.email,
        isEmailVerified: newlyCreatedUser.isEmailVerified,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Invalid server error",
      error: error,
    });
  }
}

export async function loginHandler(req: Request, res: Response) {
  try {
    const result = loginSchame.safeParse(req.body);

    if (!result.success) {
      return res.status(401).json({
        message: "Invalid data!",
        error: result.error.flatten(),
      });
    }

    const { email, password } = result.data;

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({
        message: "Email does not exist",
      });
    }

    const pwd = await comparePwd(password, user.password!);

    if (!pwd) {
      return res.status(400).json({
        message: "The passwoed does not match",
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        message: "Your email is not verified",
      });
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
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      messager: "login successfull",
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Invalid server error",
      error: error,
    });
  }
}

export async function verifyEmailHandler(req: Request, res: Response) {
  const token = req.query.token as string | undefined;

  if (!token) {
    return res.status(401).json({
      message: "Token is requried",
    });
  }

  try {
    const payload = verifyToken(token);

    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(400).json({
        message: "User does not exist",
      });
    }

    if (user.isEmailVerified) {
      return res.json({
        message: "Email is already verified",
      });
    }

    user.isEmailVerified = true;
    await user.save();

    return res.status(201).json({
      message: "Email is Verified.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Invalid server error",
      error,
    });
  }
}

export async function refreshTokenHandler(req: Request, res: Response) {
  try {
    const token = req.cookies.refreshToken as string;

    if (!token) {
      return res.status(401).json({
        message: "Refresh token not found or provided",
      });
    }

    const payload = verifyRefreshToken(token);

    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return res.status(401).json({ message: "Refresh Token invalid" });
    }

    const newAccessToken = createAccessToken(
      user.id,
      user.role,
      user.tokenVersion
    );

    const newRefreshToken = createRefreshToken(user.id, user.tokenVersion);

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      messager: "Token Refreshed",
      accessToken: newAccessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Invalid server error",
      error: error,
    });
  }
}

export const logoutHandler = (_req: Request, res: Response) => {
  res.clearCookie("refreshToken", { path: "/" });

  return res.status(201).json({
    message: "Log out",
  });
};

export async function forgetPasswordHandler(req: Request, res: Response) {
  try {
    const { email } = req.body as { email: string };

    if (!email) {
      return res.status(401).json({
        message: "Email is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.json({
        message:
          "If an account with this email exist. We will send you a reset email",
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");

    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.resetPasswordToken = tokenHash;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

    await user.save();

    const resetURL = `${getUrl()}/api/auth/reset-password?token=${rawToken}`;

    await sendEmail(
      user.email!,
      "Password reset Email",
      resetPwdHTML(resetURL)
    );

    return res.json({
      message:
        "If an account  with this email exist. We will send you a reset link",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Invlid server error",
      error: error,
    });
  }
}

export async function resetPasswordHandler(req: Request, res: Response) {
  const { token, password } = req.body as { token: string; password: string };

  if (!token) {
    return res.status(400).json({
      message: "Reset token is missing",
    });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({
      message: "Password must be 6 character long",
    });
  }

  try {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const newPassword = await hashPassword(password);
    user.resetPasswordExpires = undefined;
    user.resetPasswordToken = undefined;
    user.tokenVersion = user.tokenVersion + 1;
    user.password = newPassword;

    await user.save();

    return res.status(201).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Invalid server error",
      error,
    });
  }
}
