import express from "express";
import authRequired from "../../middleware/authRequire";
import {
  createStoryHandler,
  deleteStoryHanlder,
  viewStoryHandler,
} from "../../controller/post/story/story.controller";

const router = express();

router.post("/create", authRequired, createStoryHandler);
router.delete("/delete/:storyId", authRequired, deleteStoryHanlder);
router.post("/:storyId/view", authRequired, viewStoryHandler);

export default router;
