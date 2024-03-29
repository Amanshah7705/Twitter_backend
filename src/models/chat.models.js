import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    user1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserMainModel",
      required: true,
    },
    user2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserMainModel",
      required: true,
    },
    AllChat: [
      {
        textfrom: {
          type: Number,
          required: true,
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

const ChatModel = mongoose.model("ChatModel", ChatSchema);

export default ChatModel;
