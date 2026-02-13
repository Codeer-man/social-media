import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

//cron
import "./utils/cron";
//routes
import authRouter from "./routes/auth/auth.router";
import uploadRouter from "./routes/presignedUrl/fileUload.route";
import profileRoute from "./routes/profile/profile.route";
import postRouter from "./routes/post/post.route";
import storyRoute from "./routes/post/story.route";

import { errorHandler } from "./middleware/errorHandler";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/profile", profileRoute);
app.use("/api/post", postRouter);
app.use("/api/story", storyRoute);

//global error handler
app.use(errorHandler);

//health not req
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default app;
