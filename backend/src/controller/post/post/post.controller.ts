import { Request, Response } from "express";
import { Profile } from "../../../model/profile.model";
import { Post } from "../../../model/post/post.modle";
import { updatePostSchema } from "./post.schema";

export async function createPostHanlder(req: Request, res: Response) {
  const authUser = (req as any).user;

  if (!authUser) {
    return res.status(404).json({
      message: "You are not authenticated",
    });
  }
  try {
    const { mediaType, mediaUrl, caption, visibility } = req.body;
    if (!mediaType || !mediaUrl) {
      return res.status(409).json({
        message: "mediaType or mediaUrl is missig",
      });
    }
    const user = await Profile.findOne({ userId: authUser.id });
    if (!user) {
      return res.status(404).json({
        message: "User nor found",
      });
    }

    const newPost = await Post.create({
      author: user.id,
      mediaType: mediaType,
      mediaUrl: mediaUrl,
      caption,
      visibility,
    });

    return res
      .status(200)
      .json({ message: "Your new post has been created", data: newPost });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function deletePostHandler(req: Request, res: Response) {
  const authUser = (req as any).user;

  if (!authUser) {
    return res.status(409).json({
      message: "You are not authenticated",
    });
  }

  const postId = req.params.id;
  if (!postId) {
    return res.status(404).json({
      message: "post id is required ",
    });
  }

  try {
    const profile = await Profile.findOne({ userId: authUser.id });
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: "The post is not found",
      });
    }

    if (post.author.toString() !== profile?._id.toString()) {
      return res.status(409).json({
        message: "You are not the author of this post",
      });
    }

    await post.deleteOne(post._id);

    return res.status(201).json({
      message: "You post has been deleted",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function updatePostHandler(req: Request, res: Response) {
  const authUser = (req as any).user;
  if (!authUser) {
    return res.status(401).json({
      message: "You are not authenticated",
    });
  }

  const postId = req.params.id;
  if (!postId) {
    return res.status(401).json({
      message: "You are not authenticated",
    });
  }

  const result = updatePostSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).jsonp({
      message: result.error.flatten().fieldErrors,
    });
  }

  try {
    const post = await Post.findById(postId);
    const profile = await Profile.findOne({ userId: authUser.id });

    if (!post) {
      return res.status(401).json({
        message: "You are not authenticated",
      });
    }

    if (post.author.toString() !== profile?._id.toString()) {
      return res.status(409).json({
        message: "You are not the author of this post",
      });
    }

    const data = Object.assign(post, result.data);

    await post.save();

    return res.status(201).json({
      message: "Post updated successfully",
      result: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function viewPostHandler(req: Request, res: Response) {
  const authUser = (req as any).user;
  if (!authUser) {
    return res.status(401).json({
      message: "You are not authenticated",
    });
  }

  const postId = req.params.id;
  if (!postId) {
    return res.status(401).json({
      message: "You are not authenticated",
    });
  }

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}
