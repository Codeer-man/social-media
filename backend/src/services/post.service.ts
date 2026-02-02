import mongoose from "mongoose";

export async function toggleLike({
  model,
  resourceId,
  userId,
}: {
  model: mongoose.Model<any>;
  resourceId: string;
  userId: string;
}) {
  const docs = await model.findById(resourceId).select("likes");

  if (!docs) {
    throw new Error("Not found");
  }

  const liked = docs.likes.includes(userId);

  const update = liked
    ? { $pull: { likes: userId } }
    : { $push: { likes: userId } };

  const updatedPost = await model.findByIdAndUpdate(resourceId, update, {
    new: true,
    select: "likes",
  });

  return { updatedPost, liked };
}

export async function handleAddComment({
  model,
  comment,
  userId,
  postId,
}: {
  model: mongoose.Model<any>;
  comment: string;
  userId: string;
  postId: string;
}) {
  const docs = await model.findByIdAndUpdate(
    postId,
    {
      $push: {
        comments: {
          user: userId,
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



// export async function handleDeleteComment({
//   model,
//   userId,
//   postId,
//   commentId,
// }: {
//   model: mongoose.Model<any>;
//   userId: string;
//   postId: string;
//   commentId: string;
// }) {
//   const docs = await model.findById(postId);

//   if (!docs) {
//     return res.json({ message: `${model} not found` });
//   }

//   const commentIndex = docs.comments.findIndex(
//     (id: any) => id._id.toString() === commentId,
//   );

//   if (commentIndex === -1) {
//     return res.json({ message: "comment not found" });
//   }

//   const user = docs.comments[commentIndex].user.toString();

//   if (user !== userId) {
//     return res.json({ message: "you are not the owner of this comment" });
//   }

//   docs.comments.splice(commentIndex, 1);
//   await docs.save();

//   return {
//     success: true,
//     statusCode: 200,
//     message: "Comment deleted successfully",
//   };
// }
