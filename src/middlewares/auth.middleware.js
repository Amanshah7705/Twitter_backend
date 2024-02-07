import UserMainModel from "../models/users.models.js";
import APIERROR from "../utils/apierror.js";
import HandleMiddleware from "../utils/handlemiddleware.js";
import jwt from "jsonwebtoken";
const AuthMiddleWare = HandleMiddleware(async (req, res, next) => {
  try {
    let accessToken = req.headers.authorization;
    const d2 = accessToken.split(" ");
    accessToken = d2[1];
    if (!accessToken) {
      throw new APIERROR(401, "Unauthorized: Access token not provided");
    }

    const decodedToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    if (!decodedToken) {
      throw new APIERROR(401, "Unauthorized: Invalid access token");
    }

    const user = await UserMainModel.findOne(
      { email: decodedToken.email },
      { password: 0 }
    );
    //  console.log(user)
    if (!user) {
      throw new APIERROR(401, "Unauthorized: User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new APIERROR(401, "Unauthorized", error.errors);
  }
});

export default AuthMiddleWare;
