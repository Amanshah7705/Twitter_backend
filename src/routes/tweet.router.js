import { Router } from "express";
import AuthMiddleWare from "../middlewares/auth.middleware.js";
import { AddTweet, DeleteTweet, GetAllTweet, UpdateTweet } from "../controllers/tweet.controller.js";

const TweetRouter = Router()


TweetRouter.route("/Add").post(AuthMiddleWare,AddTweet)

TweetRouter.route("/delete").post(AuthMiddleWare,DeleteTweet)

TweetRouter.route("/update").post(AuthMiddleWare,UpdateTweet)

TweetRouter.route("/getall").post(AuthMiddleWare,GetAllTweet)
export default TweetRouter