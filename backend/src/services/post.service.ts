import mongoose from "mongoose";
import { ApiError } from "../utils/errorHandling";

export async function toggleLike({
  model,
  resourceId,
  ProfileId,
}: {
  model: mongoose.Model<any>;
  resourceId: string;
  ProfileId: string;
}) {
  const docs = await model.findById(resourceId).select("likes");

  if (!docs) {
    throw new ApiError(404, "Not found");
  }

  const liked = docs.likes.includes(ProfileId);

  const update = liked
    ? { $pull: { likes: ProfileId } }
    : { $push: { likes: ProfileId } };

  const updatedPost = await model.findByIdAndUpdate(resourceId, update, {
    new: true,
    select: "likes",
  });

  return { updatedPost, liked };
}

export async function handleAddComment({
  model,
  comment,
  ProfileId,
  postId,
}: {
  model: mongoose.Model<any>;
  comment: string;
  ProfileId: string;
  postId: string;
}) {
  const docs = await model.findByIdAndUpdate(
    postId,
    {
      $push: {
        comments: {
          user: ProfileId,
          text: comment,
          likes: [],
        },
      },
    },
    { new: true, select: "comments" },
  );

  if (!docs) {
    throw new Error("Not found");
  }

  return docs;
}

export async function handleDeleteComment({
  model,
  ProfileId,
  postId,
  commentId,
}: {
  model: mongoose.Model<any>;
  ProfileId: string;
  postId: string;
  commentId: string;
}) {
  const docs = await model.findById(postId);

  if (!docs) {
    throw new ApiError(403, `${model} not found`);
  }

  const commentIndex = docs.comments.findIndex(
    (id: any) => id._id.toString() === commentId,
  );

  if (commentIndex === -1) {
    throw new ApiError(404, "comment not found");
  }

  const user = docs.comments[commentIndex].user.toString();

  if (user !== ProfileId) {
    throw new ApiError(403, "you are not the owner of this comment");
  }

  docs.comments.splice(commentIndex, 1);
  await docs.save();

  return {
    success: true,
    statusCode: 200,
    message: "Comment deleted successfully",
  };
}

export async function handleCommentLikeToggle({
  model,
  profileId,
  postId,
  commentId,
}: {
  model: mongoose.Model<any>;
  profileId: string;
  postId: string;
  commentId: string;
}) {
  const docs = await model.findById(postId);

  if (!docs) {
    throw new ApiError(404, `${model} not found`);
  }

  const commentIndex = docs.comments.findIndex(
    (id: any) => id._id.toString() === commentId,
  );

  if (commentIndex === -1) {
    throw new ApiError(404, "Comment not found");
  }

  const comment = docs.comments[commentIndex].likes;

  const liked = comment.includes(profileId);

  const update = liked
    ? { $pull: { "comments.$.likes": profileId } }
    : { $push: { "comments.$.likes": profileId } };

  const updatePost = await model.findOneAndUpdate(
    { _id: postId, "comments._id": commentId },
    update,
    {
      new: true,
    },
  );

  return updatePost;
}

export async function handleCommentReply({
  model,
  profileId,
  commentId,
  postId,
  comment,
}: {
  model: mongoose.Model<any>;
  profileId: string;
  commentId: string;
  postId: string;
  comment: string;
}) {
  const docs = await model.findOneAndUpdate(
    { _id: postId, "comments._id": commentId },
    {
      $push: {
        "comments.$.replies": {
          user: profileId,
          text: comment,
        },
      },
    },
  );

  if (!docs) {
    throw new ApiError(404, "Post not found");
  }

  // const findComment = docs.comments.find(
  //   (id: any) => id._id.toString() === commentId,
  // );

  // if (!findComment) {
  //   throw new ApiError(404, "comment not found");
  // }
  return docs;
}
