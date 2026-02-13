import { NextFunction, Request, Response } from "express";
import { createStorySchema } from "./story.schema";
import { Story } from "../../../model/post/story.model";
import { User } from "../../../model/user.model";
import { deleteObjectSugnedUrl } from "../../../lib/presignedUrl";
import { Profile } from "../../../model/profile.model";

export async function createStoryHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authUser = (req as any).user;

  if (!authUser) {
    return res.status(401).json({
      message: "You are not authenticated",
    });
  }

  try {
    const user = await User.findOne({ _id: authUser.id });
    if (!user) {
      return res.status(409).json({
        message: "User not found",
      });
    }

    const result = createStorySchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: result.error.flatten(),
      });
    }

    const { mediaKey, mediaType, mediaUrl } = result.data;

    const newlyCreatedStory = await Story.create({
      author: authUser.profile,
      mediaType,
      mediaUrl,
      mediaKey,
    });

    return res.status(201).json({
      message: "New story has been created",
      data: newlyCreatedStory,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteStoryHanlder(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authUser = (req as any).user;

  if (!authUser) {
    return res.status(401).json({
      message: "You are not authenticated",
    });
  }

  const { storyId } = req.params;

  if (!storyId) {
    return res.status(401).json({
      message: "Story id is requried",
    });
  }

  try {
    const user = await User.findById(authUser.id);

    if (!user) {
      return res.status(409).json({
        message: "User not found",
      });
    }

    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(409).json({
        message: "story not found",
      });
    }

    await deleteObjectSugnedUrl(story.mediaKey);

    const deleteStory = await Story.findByIdAndDelete(storyId);

    return res.status(201).json({
      message: "Story successully deleted",
      data: deleteStory,
    });
  } catch (error) {
    next(error);
  }
}

export async function viewStoryHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authUser = (req as any).user;
    if (!authUser) {
      return res.status(401).json({ message: "You are not authenticated" });
    }

    const { storyId } = req.params;
    if (!storyId) {
      return res.status(400).json({ message: "Story id is required" });
    }

    const { emoji } = req.body;

    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    const authorProfile = await Profile.findById(story?.author);
    const viewerId = authUser.profile; // profile id of viewer

    //  If owner views their own story → return viewers list
    if (story.author.equals(viewerId)) {
      await story.populate({
        path: "view.user",
        select: "userName avatar _id",
      });
      return res.status(200).json({
        data: {
          viewers: story.view.map((v: any) => ({
            uid: v._id,
            userName: v.userName,
            avatar: v.avatar,
          })),
          media: story.mediaUrl,
        },
      });
    }

    //check if the viewer is follower
    const follower = authorProfile?.followers.some(
      (id) => id.toString() === viewerId,
    );

    if (!follower) {
      return res.status(403).json({ message: "Not allowed to view" });
    }

    //  Check if already viewed
    const alreadyViewed = story.view.find((id: any) => id.equals(viewerId));

    if (alreadyViewed) {
      if (emoji) alreadyViewed.emoji = emoji;
    } else {
      story.view.push({ user: viewerId, emoji: emoji || null });
    }

    await story.save();

    return res.status(200).json({
      data: {
        media: story.mediaUrl,
      },
    });
  } catch (error) {
    next(error);
  }
}
