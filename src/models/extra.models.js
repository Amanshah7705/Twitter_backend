import mongoose from "mongoose";


const ExtraFieldSchema = mongoose.Schema({
    profile_picture:{
        type:String,
        trim:true,
        default:null,
    },
    bio:{
        type:String,
        trim:true,
    },
    location:{
       type:String,
    },
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserMainModel",
        unique:true
    }
})

const ExtraFieldModel = mongoose.model('ExtraFieldModel',ExtraFieldSchema);


export default ExtraFieldModel