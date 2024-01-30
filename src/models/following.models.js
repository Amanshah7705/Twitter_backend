import mongoose from "mongoose";


const FollowerSchema = mongoose.Schema({
    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserMainModel"
    }],
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserMainModel"
    }
})


const FollowerModel = mongoose.model('FollowerModel',FollowerSchema)

export default FollowerModel

