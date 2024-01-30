import mongoose from "mongoose";


const FollowSchema = mongoose.Schema({
    follow:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserMainModel"
    }],
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserMainModel"
    }
})


const FollowModel = mongoose.model('FollowModel',FollowSchema)

export default FollowModel

