import { Request, Response } from "express";
import { createProfileSchema, updateProfileSchema } from "./profile.schema";
import { User } from "../../model/user.model";
import { Profile } from "../../model/profile.model";

export async function getDataHandler(req: Request, res: Response) {
  const authUser = (req as any).user;

  if (!authUser) {
    return res.status(404).json({ message: "auth user is requried" });
  }
  try {
    const user = await Profile.findOne({ userId: authUser.id }).select(
      "-blockedUsers -accountType",
    );

    return res.status(201).json({
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function createProfileHandler(req: Request, res: Response) {
  const authReq = req as any;

  const authUser = authReq.user;
  if (!authUser) {
    return res.status(401).json({
      message: "You are not authrized ",
    });
  }
  const result = createProfileSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).jsonp({
      message: result.error.flatten().fieldErrors,
    });
  }

  try {
    const user = await User.findById(authUser.id);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    const existingProfile = await Profile.findOne({ userId: authUser.id });

    if (existingProfile) {
      return res.status(401).json({
        message: "You profile already exist",
      });
    }

    const { name, userName, bio, location, phoneNo, website, avatar, key } =
      result.data;

    const profile = await Profile.create({
      userId: authUser.id,
      name,
      userName,
      bio,
      location,
      phoneNo,
      avatar,
      avatarKey: key,
      accountType: "public",
      website,
    });

    user.userName = userName;
    await user.save();

    return res.status(200).json({
      message: "Profile has been created",
      profile: profile,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
}

export async function updateProfileHandler(req: Request, res: Response) {
  const authReq = req as any;

  const authUser = authReq.user;

  if (!authUser) {
    return res.status(401).json({
      message: "You are not authrized ",
    });
  }

  const result = updateProfileSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).jsonp({
      message: result.error.flatten().fieldErrors,
    });
  }

  try {
    const findProfile = await Profile.findOne({ userId: authUser.id });

    if (!findProfile) {
      return res.status(401).json({
        message: "Profile not found",
      });
    }

    const data = Object.assign(findProfile, result.data);

    // findProfile.name = name ? name : findProfile.name;
    // findProfile.userName = userName;
    // findProfile.bio = bio;
    // findProfile.location = location;
    // findProfile.phoneNo = phoneNo;
    // findProfile.profilePicture = profilePicture;
    // findProfile.website = website;

    await findProfile.save();
    return res.status(200).json({
      message: "Profile updated successfully",
      result: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
