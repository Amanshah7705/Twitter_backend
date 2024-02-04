import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
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
      textfrom:{
         type:Number,
         required:true
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
    },
  ],
  OnlineOrNot: {
    type: Boolean,
  },
},
{
  timestamps: true
});

const ChatModel = mongoose.model('ChatModel', ChatSchema);

export default ChatModel;
