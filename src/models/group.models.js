import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema(
  {
    participant:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"UserMainModel"
        }
    ],
    groupname:{
       type:String,
       unique:true,
    },
    AllChat: [
      {
        textfrom: {
            type:mongoose.Schema.Types.ObjectId,
            ref:"UserMainModel"
        },
        textabout: {
          type: String,
        },
        sendimage: {
          type: String,
        },
        ReadOrNot: {
          type: Boolean,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },

      },
    ],
    OnlineOrNot: {
      type: Boolean,
    },
  },
  {
    toJSON:{
       transform:function(doc,ret){
          if(ret.AllChat && ret.AllChat.length>0){
              ret.AllChat.sort((a,b)=>b.createdAt-a.createdAt)
          }
          return ret
       }
    }
  }
);

const GroupModel = mongoose.model("GroupModel", GroupSchema);

export default GroupModel;
