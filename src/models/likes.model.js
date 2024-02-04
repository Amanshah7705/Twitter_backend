import mongoose from "mongoose";

const LikesSchema = mongoose.Schema(
  {
    whichtweet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TweetModel",
    },
    whichcomment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommentModel",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserMainModel",
    },
  },
  {
    timestamps: true,
  }
);

const LikesModel = mongoose.model("LikesModel", LikesSchema);

export default LikesModel;
