import express from "express";
import { putObjectSignedUrl } from "../../lib/presignedUrl";
import { uploadHanlder } from "../../controller/upload/upload.controller";

const router = express.Router();

router.post("/preSignedUrl", uploadHanlder);

export default router;
