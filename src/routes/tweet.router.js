import { Router } from "express";
import AuthMiddleWare from "../middlewares/auth.middleware.js";
import { AddTweet, AllTweetOfThatUser, DeleteTweet, GetAllTweet, TweetFromId, UpdateTweet } from "../controllers/tweet.controller.js";

const TweetRouter = Router()


TweetRouter.route("/add").post(AuthMiddleWare,AddTweet)

TweetRouter.route("/delete").post(AuthMiddleWare,DeleteTweet)

TweetRouter.route("/update").post(AuthMiddleWare,UpdateTweet)

TweetRouter.route("/alltweet").post(AuthMiddleWare,GetAllTweet)

TweetRouter.route('/fromid').post(AuthMiddleWare,TweetFromId)

TweetRouter.route("/getallfromthatuser").post(AuthMiddleWare,AllTweetOfThatUser)

export default TweetRouter