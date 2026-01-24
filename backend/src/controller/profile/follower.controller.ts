import { Request, Response } from "express";
import { Profile } from "../../model/profile.model";

export async function addFollowerHandler(req: Request, res: Response) {
  const authReq = req as any;
  const authUser = authReq.user;

  const targetUserName = req.params.userName;

  try {
    const user = await Profile.findOne({ userId: authUser.id });
    const otherUser = await Profile.findOne({
      userName: targetUserName,
    });

    console.log(targetUserName);
    console.log(otherUser);

    if (!user || !otherUser) {
      return res.status(400).json({
        message: "User profile not found",
      });
    }

    if (user.userName === otherUser.userName) {
      return res.status(401).json({
        message: "You cannot follow yourself",
      });
    }

    if (otherUser.blockedUsers.includes(authUser.id)) {
      return res.status(409).json({
        message: "You were blocked by this user",
      });
    }

    if (user.following.includes(otherUser._id)) {
      return res.status(400).json({
        message: "Already following this user",
      });
    }

    user.following.push(otherUser.userId!);
    user.followingCount += 1;

    otherUser.followers.push(user.userId!);
    otherUser.followersCount += 1;

    await Promise.all([user.save(), otherUser.save()]);

    return res.status(201).json({
      message: "user successfully followed",
      data: {
        userFollowingCount: user.followingCount,
        targetFollowersCount: otherUser.followersCount,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal servererror",
    });
  }
}

export async function removeFollowerHanlder(req: Request, res: Response) {
  const authReq = req as any;
  const authUser = authReq.user;
  const targetUserName = req.params.userName;

  if (!authUser) {
    return res.status(401).json({
      message: "You are not authenticated",
    });
  }

  try {
    const user = await Profile.findOne({ userId: authUser.id });
    const otherUser = await Profile.findOne({ userName: targetUserName });

    if (!user || !otherUser) {
      return res.status(404).json({
        message: "User profile not found",
      });
    }

    //  If user is NOT following otherUser
    const isFollowing = user.following.some(
      (id) => id.toString() === otherUser.userId.toString(),
    );

    if (!isFollowing) {
      return res.status(400).json({
        message: "You are not following this user",
      });
    }

    //  Remove from following
    user.following = user.following.filter(
      (id) => id.toString() !== otherUser.userId.toString(),
    );

    //  Remove from followers
    otherUser.followers = otherUser.followers.filter(
      (id) => id.toString() !== user.userId.toString(),
    );

    // Safe count update
    user.followingCount = Math.max(0, user.followingCount - 1);
    otherUser.followersCount = Math.max(0, otherUser.followersCount - 1);

    await Promise.all([user.save(), otherUser.save()]);

    return res.status(200).json({
      message: "User successfully unfollowed",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function name(req: Request) {}
