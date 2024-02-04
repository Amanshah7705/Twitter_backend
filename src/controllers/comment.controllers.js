import CommentModel from "../models/comments.models.js";
import TweetModel from "../models/tweet.models.js";
import APIERROR from "../utils/apierror.js";
import APIRESPONCE from "../utils/apiresponce.js";
import HandleMiddleware from "../utils/handlemiddleware.js";

const AddComment = HandleMiddleware(async (req, res, next) => {
  try {
    const mydata = req.user;
    const { underwhichtweet, underwhichcomment, textabout } = req.body;
    if (!textabout) {
      throw new APIERROR(501, "text not entered");
    }
    if (underwhichtweet) {
      if (underwhichtweet && underwhichcomment) {
        const checktweet = await TweetModel.find({ _id: underwhichtweet });
        if (!checktweet) {
          throw new APIERROR(501, "tweet does not exist");
        }
        const checkcomment = await CommentModel.find({
          _id: underwhichcomment,
        });
        if (!checkcomment) {
          throw new APIERROR(501, "comment does not exist");
        }
        const newcomment = new CommentModel({
          textcomment: textabout,
          owner: mydata._id,
          undertweet: underwhichtweet,
          undercomment: underwhichcomment,
        });
        await newcomment.save();
        res
          .status(200)
          .json(new APIRESPONCE(200, "Your Comment Created", newcomment));
      } else if (underwhichtweet) {
        const checktweet = await TweetModel.find({ _id: underwhichtweet });
        if (!checktweet) {
          throw new APIERROR(501, "tweet does not exist");
        }
        const newcomment = new CommentModel({
          textcomment: textabout,
          owner: mydata._id,
          undertweet: underwhichtweet,
        });
        await newcomment.save();
        res
          .status(200)
          .json(new APIRESPONCE(200, "Your Comment Created", newcomment));
      } else {
        throw new APIERROR(501, "not match with any tweet");
      }
    } else {
      throw new APIERROR(501, "tweet or comment not enterd");
    }
  } catch (error) {
    throw new APIERROR(
      501,
      "error occur at comment add movement",
      error.errors
    );
  }
});

const ShowCommentOfTweet = HandleMiddleware(async (req, res, next) => {
  const { tweetid } = req.body;
  const AllTweet = await CommentModel.find({ undertweet: tweetid })
    .sort({ createdAt: 1 })
    .select({ createdAt: 0, updatedAt: 0, __v: 0 });
  let acc = {};

  AllTweet.reduce((accumulator, user) => {
    const tweetKey = user.undercomment || tweetid;

    if (!accumulator[tweetKey]) {
      accumulator[tweetKey] = { reply: [] };
    }

    accumulator[tweetKey].reply.push(user);

    return accumulator;
  }, acc);

  const TransData = Object.keys(acc).map((key) => {
    return {
      id: key,
      reply: acc[key].reply,
    };
  });

  res.status(200).json(new APIRESPONCE(200, "Your All comment", TransData));
});

export { AddComment, ShowCommentOfTweet };
