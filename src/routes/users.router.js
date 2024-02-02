import { Router } from "express";
import { RegisterUser, LoginUser, ForgotPassword, NewPassword, UpdateDetails, FollowList, UnFollowList, UserDeatils, ProfileDeatils, SearchBar } from "../controllers/users.controllers.js";
import { upload } from '../middlewares/multer.middleware.js'
import AuthMiddleWare from "../middlewares/auth.middleware.js";
const UserRouter = Router()


UserRouter.route("/signup").post(RegisterUser)

UserRouter.route("/login").post(LoginUser)

UserRouter.route("/forgot-password").post(ForgotPassword)

UserRouter.route("/new-password").post(NewPassword)

UserRouter.route("/update-profile").post(AuthMiddleWare, upload.fields([{ name: "profile_picture", maxcount: 1 }]), UpdateDetails)
UserRouter.route("/FollowTo").post(AuthMiddleWare, FollowList)

UserRouter.route("/UnFollowTo").post(AuthMiddleWare, UnFollowList)

UserRouter.route("/profile-details").post(AuthMiddleWare, ProfileDeatils)

UserRouter.route('/searchbar').post(AuthMiddleWare, SearchBar)
export default UserRouter