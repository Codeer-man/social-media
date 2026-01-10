import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

app.use(express.json);
app.use(cookieParser());

//health not req
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

export default app;
