import mongoose from "mongoose";


const PeerSchema =  new  mongoose.Schema({
    
    UserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserMainModel"
    },
    PeerId:{
        type:String,
        required:true
    }
})

const PeerModel = new mongoose.model('PeerModel',PeerSchema)

export default PeerModel