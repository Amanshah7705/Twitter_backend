import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});


app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import UserRouter from "./routes/users.router.js";

app.use("/users", UserRouter);

import TweetRouter from "./routes/tweet.router.js";

app.use("/tweet", TweetRouter);

import LikesRouter from "./routes/likes.router.js";

app.use("/likes", LikesRouter);

import CommentRouter from "./routes/comment.router.js";

app.use("/comments", CommentRouter);


import PeerRouter from "./routes/peer.router.js";

app.use('/peer',PeerRouter)

export { app };

