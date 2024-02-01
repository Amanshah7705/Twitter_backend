import mongoose from "mongoose";

import bcrypt from 'bcryptjs'
import TweetModel from "./tweet.models.js";

const UserMainSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        trim:true,
    },
    refresh_token:{
        type:String,
        default:null
    }
})

UserMainSchema.pre('deleteOne', async function (next) {
    try {
      
      const data =  await TweetModel.deleteMany({ owner: this.getQuery()._id });
        next();
    } catch (error) {
        next(error);
    }
  });
  
const UserMainModel = mongoose.model('UserMainModel',UserMainSchema)

export default UserMainModel