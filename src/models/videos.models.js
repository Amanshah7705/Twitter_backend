import mongoose from "mongoose";


const VideoSchema = mongoose.Schema({
    url_video:{
        type:String,
    },
    ownertweet:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"TweetModel",
    },
    ownercomment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"CommentModel"
    }
},{
    timestamps: true

})

const VideoModel = mongoose.model('VideoModel',VideoSchema)

export default VideoModel;