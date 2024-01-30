import { Router } from "express";

import AuthMiddleWare from '../middlewares/auth.middleware.js'
import { AddLikes, RemoveLikes, TweetOrCommentLikesCount } from "../controllers/likes.controller.js";
const LikesRouter = Router()


LikesRouter.route("/add").post(AuthMiddleWare,AddLikes)

LikesRouter.route("/remove").post(AuthMiddleWare,RemoveLikes)

LikesRouter.route("/total").post(AuthMiddleWare,TweetOrCommentLikesCount)


export  default LikesRouter