import mongoose from "mongoose";
import LikesModel from "./likes.model.js";

const TweetSchema = mongoose.Schema({
      tweetabout:{
        type:String,
        required:true,
      },
      owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserMainModel"
      }
})
TweetSchema.pre('deleteOne', async function (next) {
  try {
    
    const data =  await LikesModel.deleteMany({ whichtweet: this.getQuery()._id });
      next();
  } catch (error) {
      next(error);
  }
});


const TweetModel = mongoose.model('TweetModel',TweetSchema);

export default TweetModel;