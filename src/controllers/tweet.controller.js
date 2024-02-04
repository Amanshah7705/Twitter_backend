import TweetModel from "../models/tweet.models.js";
import APIERROR from "../utils/apierror.js";
import APIRESPONCE from "../utils/apiresponce.js";
import HandleMiddleware from "../utils/handlemiddleware.js";
import { TweetOrCommentLikesCount } from "./likes.controller.js";
import LikesModel from "../models/likes.model.js";
import UserMainModel from "../models/users.models.js";
const AddTweet = HandleMiddleware(async (req, res, next) => {
  try {
    const mydata = req.user;
    const { tweetabout } = req.body;
    const newdata = new TweetModel({
      owner: mydata._id,
      tweetabout: tweetabout,
    });
    await newdata.save();
    res.status(200).json(new APIRESPONCE(200, "tweet added success", newdata));
  } catch (error) {
    throw new APIERROR(501, "error occur at tweet addetion", error.errors);
  }
});

const DeleteTweet = HandleMiddleware(async (req, res, next) => {
  try {
    const mydata = req.user;
    const { id_for_delete } = req.body;
    const d1 = await TweetModel.find({ _id: id_for_delete, owner: mydata._id });
    if (d1) {
      await TweetModel.deleteOne({ _id: id_for_delete });
    } else {
      throw new APIERROR(501, "Tweet Does not exist");
    }
    res.status(200).json(new APIRESPONCE(200, "tweet deleted Success"));
  } catch (error) {
    throw new APIERROR(501, "error occur at tweet deletions", error.errors);
  }
});

const UpdateTweet = HandleMiddleware(async (req, res, next) => {
  try {
    const mydata = req.user;
    const { id_for_update, tweetabout } = req.body;
    let d1 = await TweetModel.findById({ _id: id_for_update });
    if (d1) {
      d1.tweetabout = tweetabout;
      await d1.save();
    } else {
      throw new APIERROR(501, "Tweet Does not exist");
    }
    res.status(200).json(new APIRESPONCE(200, "tweet updated Success"));
  } catch (error) {
    throw new APIERROR(501, "error occur at tweet update", error.errors);
  }
});

const GetAllTweet = HandleMiddleware(async (req, res, next) => {
  try {
    const mydata = req.user;
    const result = await TweetModel.aggregate([
      {
        $lookup: {
          from: "likesmodels",
          localField: "_id",
          foreignField: "whichtweet",
          as: "likestweet",
        },
      },
      {
        $addFields: {
          totallikes: {
            $size: "$likestweet",
          },
          LikedByme: {
            $in: [mydata._id, "$likestweet.owner"],
          },
        },
      },
      {
        $lookup: {
          from: "usermainmodels",
          localField: "likestweet.owner",
          foreignField: "_id",
          as: "likestweetuser",
        },
      },
      {
        $addFields: {
          ControlByme: {
            $eq: [mydata._id, "$owner"],
          },
        },
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
      {
        $project: {
          owner: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
          likestweet: {
            whichtweet: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
            owner: 0,
          },
          likestweetuser: {
            email: 0,
            password: 0,
            refresh_token: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
          },
        },
      },
    ]);
    res.status(200).json(new APIRESPONCE(200, "all tweet from user", result));
  } catch (error) {
    throw new APIERROR(
      501,
      "error occur at geeting tweet from user",
      error.errors
    );
  }
});

const ExistTweet = HandleMiddleware(async (req, res, next) => {
  try {
    const { exist } = req.body;
    const p1 = await TweetModel.findById(exist);
    if (p1) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw new APIERROR(501, "error occur at exist tweet");
  }
});
const AllTweetOfThatUser = HandleMiddleware(async (req, res, next) => {
  try {
    const mydata = req.user;
    const d2 = await TweetModel.find({ owner: mydata._id }, { tweetabout: 1 });
    const result = await TweetModel.aggregate([
      {
        $lookup: {
          from: "likesmodels",
          localField: "_id",
          foreignField: "whichtweet",
          as: "likestweet",
        },
      },
      {
        $match: {
          owner: mydata._id,
        },
      },
      {
        $addFields: {
          totallikes: {
            $size: "$likestweet",
          },
          LikedByme: {
            $in: [mydata._id, "$likestweet.owner"],
          },
        },
      },
      {
        $lookup: {
          from: "usermainmodels",
          localField: "likestweet.owner",
          foreignField: "_id",
          as: "likestweetuser",
        },
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
      {
        $project: {
          owner: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
          likestweet: {
            whichtweet: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
            owner: 0,
          },
          likestweetuser: {
            email: 0,
            password: 0,
            refresh_token: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
          },
        },
      },
    ]);

    res.status(200).json(new APIRESPONCE(200, "all tweet from user", result));
  } catch (error) {
    throw new APIERROR(
      501,
      "error occur at geeting tweet from user",
      error.errors
    );
  }
});

const TweetFromId = HandleMiddleware(async (req, res, next) => {
  const { id } = req.body;
  const data = await TweetModel.findById(id);
  res.status(200).json(new APIRESPONCE(200, "Tweet You serch for", data));
});

export {
  AddTweet,
  DeleteTweet,
  UpdateTweet,
  GetAllTweet,
  ExistTweet,
  AllTweetOfThatUser,
  TweetFromId,
};
