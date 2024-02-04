import LikesModel from "../models/likes.model.js";
import APIERROR from "../utils/apierror.js";
import APIRESPONCE from "../utils/apiresponce.js";
import HandleMiddleware from "../utils/handlemiddleware.js";

const AddLikes = HandleMiddleware(async (req, res, next) => {
  try {
    const mydata = req.user;

    const { whichtweet, whichcomment } = req.body;
    if (whichcomment || whichtweet) {
      if (whichtweet) {
        const p1 = await LikesModel.findOne({
          owner: mydata._id,
          whichtweet: whichtweet,
        });
        if (p1 != null && p1?.whichtweet != null) {
          throw new APIERROR(501, "Allready liked");
        }
        const p2 = new LikesModel({
          owner: mydata._id,
          whichtweet: whichtweet,
        });
        await p2.save();
      } else {
        const p1 = await LikesModel.findOne({
          owner: mydata._id,
          whichcomment: whichcomment,
        });
        if (p1 != null && p1?.whichcomment != null) {
          throw new APIERROR(501, "Allready liked");
        }
        const p2 = new LikesModel({
          owner: mydata._id,
          whichcomment: whichcomment,
        });
        await p2.save();
      }
      res.status(200).json(new APIRESPONCE(200, "Liked success"));
    } else {
      throw new APIERROR(501, "tweet or comment does not exist");
    }
  } catch (error) {
    throw new APIERROR(501, "error occur at liked tweet");
  }
});

const RemoveLikes = HandleMiddleware(async (req, res, next) => {
  try {
    const mydata = req.user;

    const { whichtweet, whichcomment } = req.body;

    if (whichcomment || whichtweet) {
      if (whichtweet) {
        const p1 = await LikesModel.findOne({
          owner: mydata._id,
          whichtweet: whichtweet,
        });
        if (!p1) {
          throw new APIERROR(501, "not liked");
        }
        await LikesModel.deleteOne({
          owner: mydata._id,
          whichtweet: whichtweet,
        });
      } else {
        const p1 = await LikesModel.findOne({
          owner: mydata._id,
          whichcomment: whichcomment,
        });
        if (!p1) {
          throw new APIERROR(501, "not liked");
        }
        await LikesModel.deleteOne({
          owner: mydata._id,
          whichcomment: whichcomment,
        });
      }
      res.status(200).json(new APIRESPONCE(200, "UnLiked success"));
    } else {
      throw new APIERROR(501, "tweet or comment does not exist");
    }
  } catch (error) {
    throw new APIERROR(501, "error occur at Unliked tweet");
  }
});

const TweetOrCommentLikesCount = HandleMiddleware(async (req, res, next) => {
  try {
    const { tweetid, commentid } = req.body;
    if (tweetid || commentid) {
      const p1 = await LikesModel.aggregate([
        {
          $match: {
            $or: [{ whichtweet: tweetid }, { whichcomment: commentid }],
          },
        },
        {
          $group: {
            _id: null,
            counter: {
              $sum: 1,
            },
          },
        },
        {
          $project: {
            _id: 0,
            counter: 1,
          },
        },
      ]);
      res.status(200).json(new APIRESPONCE(200, "likes total", p1));
    } else {
      throw new APIERROR(501, "tweet or comment id does not entered");
    }
  } catch (error) {
    throw new APIERROR(
      500,
      "error occur at total likes or comment part",
      error.errors
    );
  }
});

const LikedByme = HandleMiddleware(async (req, res, next) => {
  try {
    const { whichtweet } = req.body;
    const mydata = req.user;
    const d1 = await LikesModel.findOne({
      whichtweet: whichtweet,
      owner: mydata._id,
    });
    res.status(200).json(new APIRESPONCE(200, "Your Details", d1));
  } catch (error) {
    throw new APIERROR(500, "Error occur at liked by me");
  }
});

export { AddLikes, RemoveLikes, TweetOrCommentLikesCount, LikedByme };
