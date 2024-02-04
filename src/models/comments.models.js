import mongoose from "mongoose";

const CommentSchema = mongoose.Schema(
  {
    textcomment: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserMainModel",
    },
    undertweet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TweetModel",
    },
    underComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommentModel",
    },
  },
  {
    timestamps: true,
  }
);

const CommentModel = mongoose.model("CommentModel", CommentSchema);

export default CommentModel;
