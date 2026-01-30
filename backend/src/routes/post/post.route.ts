import express from "express";
import authRequired from "../../middleware/authRequire";
import {
  createPostHanlder,
  deletePostHandler,
  updatePostHandler,
  viewPostHandler,
} from "../../controller/post/post/post.controller";

const router = express.Router();

router.post("/create", authRequired, createPostHanlder);
router.delete("/delete/:id", authRequired, deletePostHandler);
router.patch("/update/:id", authRequired, updatePostHandler);
router.get("/:id", viewPostHandler);

export default router;
