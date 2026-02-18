import { NextFunction, request, Request, response, Response } from "express";
import { Profile } from "../../../model/profile.model";
import { Post } from "../../../model/post/post.modle";
import { updatePostSchema } from "./post.schema";
import { deleteObjectSugnedUrl } from "../../../lib/presignedUrl";
import {
  handleAddComment,
  handleCommentLikeToggle,
  handleCommentReply,
  handleDeleteComment,
  toggleLike,
} from "../../../services/post.service";
import {
  createNotification,
  removeNotification,
} from "../../../services/notification.service";

export async function createPostHanlder(req: Request, res: Response) {
  const authUser = (req as any).user;

  if (!authUser) {
    return res.status(404).json({
      message: "You are not authenticated",
    });
  }
  try {
    const { mediaType, mediaUrl, caption, visibility, key } = req.body;
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
      mediaKey: key,
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

    await deleteObjectSugnedUrl(post.mediaKey);
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

  const postId = req.params.postId;
  if (!postId) {
    return res.status(400).json({
      message: "You are not authenticated",
    });
  }

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const authorId = post.author.toString();
    const profile = await Profile.findOne({ userId: authUser.id });
    const profileId = profile?._id?.toString();

    //  Private post
    if (post.visibility === "private") {
      if (authorId !== profileId) {
        return res.status(400).json({
          message: "sorry this post is privated by the author",
        });
      }
    }

    // Followers-only post
    if (post.visibility === "followers") {
      if (authorId !== profileId) {
        const profile = await Profile.findById(post.author);
        const isFollower = profile?.followers.some(
          (id) => id.toString() === authUser.id,
        );
        if (!isFollower) {
          return res.status(201).json({
            message: "Sorry this post is only for followers",
          });
        }
      }
    }

    // increase view if access granted
    await Post.updateOne({ _id: postId }, { $inc: { viewCount: 1 } });

    return res.status(201).json({
      data: post,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function likePostHandler(req: Request, res: Response) {
  const authUser = (req as any).user;
  if (!authUser) {
    return res.status(401).json({
      message: "You are not authenticated",
    });
  }

  const postId = req.params.postId;
  if (!postId) {
    return res.status(400).json({
      message: "You are not authenticated",
    });
  }
  try {
    const result = await toggleLike({
      model: Post,
      resourceId: postId,
      ProfileId: authUser.profile,
    });

    // notification
    if (!result.liked) {
      await createNotification({
        receiptId: result.author,
        senderId: authUser.profile,
        type: "POST_LIKE",
        entityId: result.updatedPost._id,
        entityModel: "Post",
      });
    } else {
      await removeNotification({
        receiptId: result.author,
        senderId: authUser.profile,
        type: "POST_LIKE",
        entityId: result.updatedPost._id,
      });
    }

    return res.status(200).json({
      message: result.liked ? "Post unlikes" : "Post liked",
      data: result.updatedPost,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

export async function commentPostHandler(
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

  const postId = req.params.postId;
  if (!postId) {
    return res.status(400).json({
      message: "You are not authenticated",
    });
  }
  const { commentText } = req.body;
  if (!commentText) {
    return res.status(400).json({
      message: "comment is required",
    });
  }
  try {
    const result = await handleAddComment({
      model: Post,
      comment: commentText,
      ProfileId: authUser.profile,
      postId: postId,
    });

    console.log(result);

    //notification
    await createNotification({
      receiptId: result.author,
      senderId: authUser.profile,
      type: "POST_COMMENT",
      entityId: result._id,
      entityModel: "Post",
      extraText: commentText,
    });

    return res
      .status(200)
      .json({ message: "new message has been added", result: result });
  } catch (error) {
    next(error);
  }
}

export async function commentDeleteHandler(req: Request, res: Response) {
  const authUser = (req as any).user;
  if (!authUser) {
    return res.status(401).json({
      message: "You are not authenticated",
    });
  }

  const { postId, commentId } = req.params;
  if (!postId || !commentId) {
    return res.status(404).json({
      message: "post or comment not found",
    });
  }

  try {
    const result = await handleDeleteComment({
      model: Post,
      ProfileId: authUser.profile,
      postId: postId,
      commentId: commentId,
    });

    console.log(result, "delete");

    //notification
    await removeNotification({
      receiptId: result.docs.author,
      senderId: authUser.profile,
      type: "POST_COMMENT",
      entityId: result.docs._id,
    });

    return res.status(200).json({ message: "Comment deleted ", data: result });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
      error,
    });
  }
}

export async function commentLikeHanlder(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authUser = (req as any).user;

  if (!authUser) {
    return res.status(404).json({
      message: "Auth is reqiured",
    });
  }

  const { postId, commentId } = req.params;
  if (!postId || !commentId) {
    return res.status(404).json({ message: " post or comment id is missing " });
  }

  try {
    const result = await handleCommentLikeToggle({
      model: Post,
      profileId: authUser.profile,
      postId: postId,
      commentId: commentId,
    });

    //notification
    if (!result.liked) {
      await createNotification({
        receiptId: result.updatePost.author,
        senderId: authUser.profile,
        entityId: result.updatePost._id,
        entityModel: "Post",
        type: "COMMENT_LIKE",
        extraText: result.updatePost.comments[0].text,
      });
    } else {
      await removeNotification({
        receiptId: result.updatePost.author,
        senderId: authUser.profile,
        entityId: result.updatePost._id,
        type: "COMMENT_LIKE",
      });
    }

    return res.status(201).json({
      result: result,
      message: result.liked ? "You disliked" : "You liked",
    });
  } catch (error) {
    next(error);
  }
}

export async function commentReplyHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authUser = (req as any).user;
  if (!authUser) {
    return res.status(404).json({
      message: "You are not authenticated",
    });
  }

  const { commentId, postId } = req.params;
  if (!commentId || !postId) {
    return res.status(404).json({
      message: "commentId or postId is missing",
    });
  }

  const { reply } = req.body;
  if (!reply) {
    return res.status(404).json({
      message: "You cannot give blank space",
    });
  }

  try {
    const result = await handleCommentReply({
      model: Post,
      commentId: commentId,
      postId: postId,
      profileId: authUser.profileId,
      comment: reply,
    });
    console.log(result, "result");

    //notification
    await createNotification({
      receiptId: result.author,
      senderId: authUser.profile,
      entityModel: "Post",
      entityId: result._id,
      type: "COMMENT_REPLY",
      extraText: reply,
    });

    return res.status(201).json({
      result,
    });
  } catch (error) {
    next(error);
  }
}
