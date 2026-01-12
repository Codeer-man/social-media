import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth/auth.router";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);

//health not req
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default app;
