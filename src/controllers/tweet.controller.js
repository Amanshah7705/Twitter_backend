import TweetModel from "../models/tweet.models.js";
import APIERROR from "../utils/apierror.js";
import APIRESPONCE from "../utils/apiresponce.js";
import HandleMiddleware from "../utils/handlemiddleware.js";


const AddTweet = HandleMiddleware(async(req,res,next)=>{
      try {
        const mydata = req.user
        const {tweetabout} = req.body
        const newdata = new TweetModel({
          owner:mydata._id,
          tweetabout:tweetabout
        })
        await newdata.save()
        res.status(200).json(new APIRESPONCE(200,"tweet added success",newdata))
      } catch (error) {
           throw new APIERROR(501,"error occur at tweet addetion",error.errors)
      }
})

const DeleteTweet = HandleMiddleware(async(req,res,next)=>{
    try {
        const mydata = req.user
        const {id_for_delete} = req.body
        const d1 = await TweetModel.findById({_id : id_for_delete})
        if(d1){
                  await TweetModel.deleteOne({_id : id_for_delete})
        }
        else{
            throw new APIERROR(501,"Tweet Does not exist",)
        }
        res.status(200).json(new APIRESPONCE(200,"tweet deleted Success",))
    } catch (error) {
        throw new APIERROR(501,"error occur at tweet deletions",error.errors)
    }
})

const UpdateTweet  = HandleMiddleware(async(req,res,next)=>{
    try {
        const mydata = req.user
        const {id_for_update,tweetabout} = req.body
        let d1 = await TweetModel.findById({_id : id_for_update})
        if(d1){
                  d1.tweetabout = tweetabout;
                  await d1.save()
        }
        else{
            throw new APIERROR(501,"Tweet Does not exist",)
        }
        res.status(200).json(new APIRESPONCE(200,"tweet updated Success",))
    } catch (error) {
        throw new APIERROR(501,"error occur at tweet update",error.errors)
    }
})

const GetAllTweet = HandleMiddleware(async(req,res,next)=>{
    try {
        const mydata = req.user
        const d2 = await TweetModel.find({owner:mydata._id},{tweetabout:1})
        res.status(200).json(new APIRESPONCE(200,"all tweet from user",d2))
    } catch (error) {
         throw new APIERROR(501,"error occur at geeting tweet from user",error.errors)
    }
})

const ExistTweet = HandleMiddleware(async(req,res,next)=>{
    try {
        const {exist} = req.body
        const p1=await TweetModel.findById(exist)
        if(p1){
            return true;
        }
        else{
            return false;
        }
    } catch (error) {
         throw new APIERROR(501,"error occur at exist tweet",)
    }
})
const AllTweetOfThatUser = HandleMiddleware(async(req,res,next)=>{
    try {
        const {user_id} = req.body
        const p1= await TweetModel.find({owner:user_id});
        return p1;
    } catch (error) {
         throw new APIERROR(501,"error occur at All tweet of user moment",)
    }
})
export {AddTweet,DeleteTweet,UpdateTweet,GetAllTweet,ExistTweet,AllTweetOfThatUser}