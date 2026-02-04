import express from "express";
import authRequired from "../../middleware/authRequire";
import {
  commentDeleteHandler,
  commentLikeHanlder,
  commentPostHandler,
  commentReplyHandler,
  createPostHanlder,
  deletePostHandler,
  likePostHandler,
  updatePostHandler,
  viewPostHandler,
} from "../../controller/post/post/post.controller";

const router = express.Router();

router.post("/create", authRequired, createPostHanlder);
router.delete("/delete/:id", authRequired, deletePostHandler);
router.patch("/update/:id", authRequired, updatePostHandler);

// view
router.patch("/view/:postId", authRequired, viewPostHandler);

//like and  comment
router.patch("/like/:postId", authRequired, likePostHandler);
router.patch("/comment/:postId", authRequired, commentPostHandler);
router.patch(
  "/:postId/comment/:commentId/delete",
  authRequired,
  commentDeleteHandler,
);
router.patch(
  "/:postId/comment/:commentId/like",
  authRequired,
  commentLikeHanlder,
);

router.patch(
  "/:postId/comment/:commentId/reply",
  authRequired,
  commentReplyHandler,
);

export default router;
