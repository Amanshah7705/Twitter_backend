import HandleMiddleware from "../utils/handlemiddleware.js";
import UserMainModel from "../models/users.models.js";
import APIERROR from "../utils/apierror.js";
import bcrypt from "bcryptjs";
import APIRESPONCE from "../utils/apiresponce.js";
import jwt from "jsonwebtoken";
import { transporter, mailOptions } from "../constant.js";
import upload_on_cloud from "../utils/fileupload.js";
import ExtraFieldModel from "../models/extra.models.js";
import FollowModel from "../models/follow.models.js";
import FollowerModel from "../models/following.models.js";
const options = {
  httpOnly: true,
  secure: true,
};
const MakePassword = async (password) => {
  const newPassword = await bcrypt.hash(password, 10);
  return newPassword;
};
const MatchPassword = async (password1, password2) => {
  const match = await bcrypt.compare(password1, password2);
  return match;
};
const GenerateAccessToken = async (userId) => {
  const data = await UserMainModel.findOne({ username: userId });
  if (!data) {
    throw new APIERROR(501, "Data does not exist for jwt");
  }
  const token1 = await jwt.sign(
    {
      _id: data._id,
      email: data.email,
      username: data.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );

  return token1;
};
const GenerateRefreshToken = async (userId) => {
  const data = await UserMainModel.findOne({ username: userId });
  if (!data) {
    throw new APIERROR(501, "Data does not exist for jwt");
  }
  const token1 = await jwt.sign(
    {
      _id: data._id,
      email: data.email,
      username: data.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
  return token1;
};
const RegisterUser = HandleMiddleware(async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      throw new APIERROR(501, "all field is required");
    }
    const newData1 = await UserMainModel.findOne({ username: username });
    const newData2 = await UserMainModel.findOne({ email: email });
    if (newData1 || newData2) {
      throw new APIERROR(501, "user allready exist");
    }
    const newUser = await new UserMainModel({
      username: username,
      email: email,
      password: await MakePassword(password),
    });
    await newUser.save();
    const newData3 = {
      username: newUser.username,
      email: newUser.email,
    };

    res.status(200).json(new APIRESPONCE(500, "User Created", newData3));
  } catch (error) {
    throw new APIERROR(500, "ERROR OCCUR AT USER CREATION", error.errors);
  }
});
const LoginUser = HandleMiddleware(async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new APIERROR(501, "all field is required");
    }
    let newData = await UserMainModel.findOne({ username: username });

    if (!newData) {
      throw new APIERROR(501, "User does not exist");
    }
    const change = await MatchPassword(password, newData.password);
    if (!change) {
      throw new APIERROR(501, "Password not match");
    }
    // if(newData.refresh_token !=  null){
    //     let newData3={
    //         username:newData.username,
    //         email:newData.email
    //     }
    //     res.status(200).json(new APIRESPONCE(200,"Logged Success",newData3))

    // }
    // else{
    const accessToken1 = await GenerateAccessToken(username);
    const refreshToken1 = await GenerateRefreshToken(username);

    newData.refresh_token = refreshToken1;
    await newData.save();
    let newData3 = {
      username: newData.username,
      email: newData.email,
      accessToken: accessToken1,
      refreshToken: refreshToken1,
    };
    res.status(200).json(new APIRESPONCE(200, "Logged Success", newData3));
  } catch (error) {
    throw new APIERROR(501, "error occur at login", error.errors);
  }
});
const ForgotPassword = HandleMiddleware(async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new APIERROR(500, "Email is required");
    }

    mailOptions.to = email;
    mailOptions.text = `This is a new link for your password: ${process.env.PATH1}/NewPassword`;

    const data2 = await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset link sent successfully" });
  } catch (error) {
    throw new APIERROR(
      501,
      "Error occurred while processing forgot password request"
    );
  }
});

const NewPassword = HandleMiddleware(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new APIERROR(501, "user does not exist");
  }
  let newData = await UserMainModel.findOne({ email: email });
  if (!newData) {
    throw new APIERROR(501, "user not reg please reg");
  }
  newData.password = await MakePassword(password);
  await newData.save();

  res.status(200).json(
    new APIRESPONCE(200, "Done", {
      username: newData.username,
      email: newData.email,
    })
  );
});
const UpdateDetails = HandleMiddleware(async (req, res, next) => {
  try {
    const mydata = req.user;
    let profile_picture = null;
    profile_picture = req.files?.profile_picture[0]?.path;
    const check = await ExtraFieldModel.findOne({ user_id: mydata._id });
    if (check != null) {
      throw new APIERROR(501, "User allready updated");
    }
    const { bio, location } = req.body;
    const pp = await upload_on_cloud(profile_picture);

    const newData1 = await new ExtraFieldModel({
      bio: bio,
      location: location,
      profile_picture: pp.url,
      user_id: mydata._id,
    });

    await newData1.save();
    res.status(200).json(new APIRESPONCE(200, "Profile updated", newData1));
  } catch (error) {
    throw new APIERROR(
      501,
      "Error occurred while updating profile",
      error.errors
    );
  }
});
const FollowList = HandleMiddleware(async (req, res, next) => {
  try {
    const mydata = req.user;
    const { followto } = req.body;

    const userdata = await UserMainModel.findOne({ _id: followto });
    if (!userdata) {
      throw new APIERROR(501, "User does not exist for follow request");
    }

    const d1 = await FollowModel.findOne({
      admin: mydata._id,
      follow: { $in: [userdata._id] },
    });

    if (d1) {
      throw new APIERROR(501, "User already followed");
    } else {
      const d4 = await FollowModel.findOne({ admin: mydata._id });

      if (d4) {
        d4.follow.push(userdata._id);
        await d4.save();
      } else {
        const d3 = new FollowModel({
          admin: mydata._id,
          follow: [userdata._id],
        });
        await d3.save();
      }

      const d5 = await FollowerModel.findOne({ admin: userdata._id });

      if (d5) {
        d5.followers.push(mydata._id);
        await d5.save();
      } else {
        const d3 = new FollowerModel({
          admin: userdata._id,
          followers: [mydata._id],
        });
        await d3.save();
      }
    }

    const m2 = await FollowModel.aggregate([
      {
        $match: {
          admin: mydata._id,
        },
      },
      {
        $addFields: {
          followCount: { $size: "$follow" },
        },
      },
    ]);

    const m3 = await FollowerModel.aggregate([
      {
        $match: {
          admin: userdata._id,
        },
      },
      {
        $addFields: {
          followerCount: { $size: "$followers" },
        },
      },
    ]);

    const res_data = {
      follower: m3[0] ? m3[0].followerCount : 0,
      following: m2[0] ? m2[0].followCount : 0,
    };

    res.status(200).json(new APIRESPONCE(500, "Followed Success", res_data));
  } catch (error) {
    throw new APIERROR(501, "error occur at follew part");
  }
});

const UnFollowList = HandleMiddleware(async (req, res, next) => {
  try {
    const mydata = req.user;
    const { unfollow } = req.body;
    const unfollowedUser = await UserMainModel.findOne({ _id: unfollow });

    if (!unfollowedUser) {
      throw new APIERROR(501, "User does not exist for unfollow request");
    }

    await FollowModel.updateOne(
      { admin: mydata._id },
      { $pull: { follow: unfollowedUser._id } }
    );

    await FollowerModel.updateOne(
      { admin: unfollowedUser._id },
      { $pull: { followers: mydata._id } }
    );

    const datax1 = await FollowModel.findOne({ admin: mydata._id });
    const datax2 = await FollowerModel.findOne({ admin: unfollow });
    if (datax1.follow.length === 0) {
      await FollowModel.deleteOne({ admin: mydata._id });
    }
    if (datax2.followers.length === 0) {
      await FollowerModel.deleteOne({ admin: unfollow });
    }
    const m2 = await FollowModel.aggregate([
      {
        $match: {
          admin: mydata._id,
        },
      },
      {
        $addFields: {
          followCount: { $size: "$follow" },
        },
      },
    ]);
    const m3 = await FollowerModel.aggregate([
      {
        $match: {
          admin: unfollowedUser._id,
        },
      },
      {
        $addFields: {
          followerCount: { $size: "$followers" },
        },
      },
    ]);

    const res_data = {
      follower: m3[0]?.followerCount || 0,
      following: m2[0]?.followCount || 0,
    };
    res.status(200).json(new APIRESPONCE(500, "Unfollowed Success", res_data));
  } catch (error) {
    throw new APIERROR(501, "error occur at unfollwe part");
  }
});

const UserDeatils = HandleMiddleware(async (req, res, next) => {
  try {
    const { username } = req.body;
    const p1 = await UserMainModel.find(
      { username: username },
      { refresh_token: 0 }
    );
    return p1;
  } catch (error) {
    throw new APIERROR(501, "error occur at user details moment");
  }
});
const TimePass = HandleMiddleware(async (req, res, next) => {
  res.json({ message: "1" });
});

const ProfileDeatils = HandleMiddleware(async (req, res, next) => {
  try {
    const { id_for_deatils } = req.body;
    const mydata = req.user;
    const id3 = mydata._id;
    if (!id_for_deatils) {
      throw new APIERROR(501, "Enter id for deatils");
    }
    const data = await UserMainModel.findById(id_for_deatils);
    if (!data) {
      throw new APIERROR(501, "User does not exist");
    }
    let totaldata = await UserMainModel.aggregate([
      {
        $match: {
          _id: data._id,
        },
      },
      {
        $lookup: {
          from: "extrafieldmodels",
          localField: "_id",
          foreignField: "user_id",
          as: "userextraField",
        },
      },
      {
        $lookup: {
          from: "followmodels",
          localField: "_id",
          foreignField: "admin",
          as: "TotalFollowPart",
        },
      },
      {
        $lookup: {
          from: "followermodels",
          localField: "_id",
          foreignField: "admin",
          as: "TotalFollowingPart",
        },
      },
      {
        $project: {
          password: 0,
          refresh_token: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
          userextraField: {
            _id: 0,
            user_id: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
          },
          TotalFollowPart: {
            _id: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
          },
          TotalFollowingPart: {
            _id: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
          },
        },
      },
    ]);
    let follow = 0;
    if (totaldata[0]?.TotalFollowPart[0]?.follow?.length) {
      follow = totaldata[0]?.TotalFollowPart[0]?.follow?.length;
    }
    let following = 0;

    if (totaldata[0]?.TotalFollowingPart[0]?.followers?.length) {
      following = totaldata[0]?.TotalFollowingPart[0]?.followers?.length;
    }
    let meka = await totaldata[0].TotalFollowingPart[0].followers.find(
      (item) => item.toString() === mydata._id.toString()
    );
    if (meka) {
      meka = true;
    } else {
      meka = false;
    }
    totaldata[0].TotalFollow = follow;
    (totaldata[0].TotalFollowing = following),
      (totaldata[0].IFollowedHim = meka);
    res.status(200).json(new APIRESPONCE(200, "Your Deatils", totaldata));
  } catch (error) {
    throw new APIERROR(500, "error occur at deatils fetch part", error.errors);
  }
});

const SearchBar = HandleMiddleware(async (req, res, next) => {
  try {
    const totaldata = await UserMainModel.aggregate([
      {
        $lookup: {
          from: "extrafieldmodels",
          localField: "_id",
          foreignField: "user_id",
          as: "userextraField",
        },
      },
      {
        $project: {
          email: 0,
          password: 0,
          refresh_token: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
          userextraField: {
            _id: 0,
            bio: 0,
            location: 0,
            user_id: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
          },
        },
      },
    ]);

    res.status(200).json(new APIRESPONCE(200, "Your Deatils", totaldata));
  } catch (error) {
    throw new APIERROR(500, "error occur at deatils fetch part", error.errors);
  }
});
const getUserInfo = async (userId) => {
  return UserMainModel.findOne({ _id: userId }, { username: 1, _id: 0 });
};

const DeatilsForList = HandleMiddleware(async (req, res, next) => {
  const { list_of_user } = req.body;
  let acc = [];
  const promises = list_of_user.map(async (userId) => {
    const datax = await getUserInfo(userId);
    acc.push({
      userId: userId,
      username: datax.username,
    });
  });

  await Promise.all(promises);

  res.status(200).json(new APIRESPONCE(200, "Your list", acc));
});

const GetUsername = HandleMiddleware(async (req, res, next) => {
  try {
    const mydata = req.user;
    res
      .status(200)
      .json(new APIRESPONCE(200, "your username", { userId: mydata._id }));
  } catch (error) {
    throw new APIERROR(501, "error occur at getuser part", error.errors);
  }
});

const ListOfuser = HandleMiddleware(async (req, res, next) => {
  try {
    const data = await UserMainModel.find();
    const acc = {};
    data.reduce((_, user) => {
      acc[user._id] = user.username;
      return acc;
    }, {});

    res.status(200).json(new APIRESPONCE(200, "ALL list of user", acc));
  } catch (error) {
    throw new APIERROR(500, "eror occur at username find part", error.errors);
  }
});
export {
  RegisterUser,
  LoginUser,
  GenerateAccessToken,
  GenerateRefreshToken,
  ForgotPassword,
  NewPassword,
  UpdateDetails,
  FollowList,
  UnFollowList,
  UserDeatils,
  TimePass,
  ProfileDeatils,
  SearchBar,
  DeatilsForList,
  GetUsername,
  ListOfuser,
};
