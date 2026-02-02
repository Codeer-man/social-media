import express from "express";
import { uploadHanlder } from "../../controller/upload/upload.controller";

const router = express.Router();

router.post("/preSignedUrl", uploadHanlder);

export default router;
