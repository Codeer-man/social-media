import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
//cron
import "./utils/cron";
//routes
import authRouter from "./routes/auth/auth.router";
import uploadRouter from "./routes/presignedUrl/fileUload.route";
import profileRoute from "./routes/profile/profile.route";
import postRouter from "./routes/post/post.route";
import storyRoute from "./routes/post/story.route";
import notiRoute from "./routes/notification/noti.route";

import { errorHandler } from "./middleware/errorHandler";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

//cors
app.use(
  cors({
    origin: process.env.FRONTEND_URL!,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  }),
);

app.use("/api/auth", authRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/profile", profileRoute);
app.use("/api/post", postRouter);
app.use("/api/story", storyRoute);
app.use("/api/noti", notiRoute);

//global error handler
app.use(errorHandler);

//health not req
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default app;
