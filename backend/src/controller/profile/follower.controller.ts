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

export async function fetchUserHandler(req: Request, res: Response) {
  const authReq = req as any;
  const authUser = authReq.user;

  if (!authUser) {
    return res.status(401).json({
      message: "User not found",
    });
  }

  const { type } = req.params;

  // if (type !== "following" || type !== "followers" || type !== "block") {
  //   return res.status(404).json({
  //     message: "type is requried",
  //   });
  // }

  try {
    const user = await Profile.findOne({ userId: authUser.id })
      .populate({ path: "followers", select: "userName avatar" })
      .populate({ path: "following", select: "userName avatar" })
      .populate({ path: "blockedUsers", select: "userName avatar" });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (type === "followers") {
      return res
        .status(200)
        .json({ data: user.followers, count: user.followersCount });
    }
    if (type === "following") {
      return res
        .status(200)
        .json({ data: user.following, count: user.followingCount });
    }
    if (type === "block") {
      return res.status(200).json({ data: user.blockedUsers });
    }

    return res.status;
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function blockUserHandler(req: Request, res: Response) {
  const auth = req as any;
  const authUser = auth.user;

  if (!authUser) {
    return res.status(401).json({
      message: "User not found",
    });
  }
  const targetUser = req.params.userName;

  if (!targetUser) {
    return res.status(404).json({
      message: "Other user not found",
    });
  }

  try {
    const user = await Profile.findOne({ userId: authUser.id });
    const otherUser = await Profile.findOne({ userName: targetUser });

    if (!user || !otherUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.userName === otherUser.userName) {
      return res.status(401).json({
        message: "You can unblock yourself",
      });
    }

    if (user.blockedUsers.includes(otherUser.userId)) {
      return res
        .status(400)
        .json({ message: "User already blocked this user" });
    }

    user.blockedUsers.push(otherUser.userId);

    //  Remove from user
    user.following = user.following.filter(
      (id) => id.toString() !== otherUser.userId.toString(),
    );

    user.followers = user.followers.filter(
      (id) => id.toString() !== otherUser.userId.toString(),
    );

    //  Remove from otheruser
    otherUser.followers = otherUser.followers.filter(
      (id) => id.toString() !== user.userId.toString(),
    );

    otherUser.following = otherUser.following.filter(
      (id) => id.toString() !== user.userId.toString(),
    );

    // Safe count update
    user.followingCount = Math.max(0, user.followingCount - 1);
    user.followersCount = Math.max(0, user.followersCount - 1);
    otherUser.followersCount = Math.max(0, otherUser.followersCount - 1);
    otherUser.followingCount = Math.max(0, otherUser.followingCount - 1);

    await Promise.all([user.save(), otherUser.save()]);

    return res.status(200).json({
      message: "You have successfully banned the user",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function unBlockUserHandler(req: Request, res: Response) {
  const auth = req as any;
  const authUser = auth.user;

  if (!authUser) {
    return res.status(401).json({
      message: "User not found",
    });
  }
  const targetUser = req.params.userName;

  if (!targetUser) {
    return res.status(404).json({
      message: "Other user not provided",
    });
  }

  try {
    const user = await Profile.findOne({ userId: authUser.id });
    const otherUser = await Profile.findOne({ userName: targetUser });

    if (!user || !otherUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.userName === otherUser.userName) {
      return res.status(401).json({
        message: "You can unblock yourself",
      });
    }

    if (!user.blockedUsers.includes(otherUser.userId)) {
      return res.status(401).json({
        message: "You cannot unblock the not blocked user",
      });
    }

    user.blockedUsers = user.blockedUsers.filter(
      (id) => id.toString() !== otherUser.userId.toString(),
    );

    await user.save();

    return res.status(201).json({
      message: "User successfully unblocked",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
