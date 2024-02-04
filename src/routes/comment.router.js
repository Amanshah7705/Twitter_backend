import { Router } from "express";

import AuthMiddleWare from "../middlewares/auth.middleware.js";
import {
  AddComment,
  ShowCommentOfTweet,
} from "../controllers/comment.controllers.js";
const CommentRouter = Router();

CommentRouter.route("/add").post(AuthMiddleWare, AddComment);
CommentRouter.route("/show").post(AuthMiddleWare, ShowCommentOfTweet);
export default CommentRouter;
