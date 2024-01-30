import mongoose from "mongoose";

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


const TweetModel = mongoose.model('TweetModel',TweetSchema);

export default TweetModel;