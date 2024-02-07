import http from "http";
import { Server } from "socket.io";
import { app } from "../app.js";
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
  },
});
import ChatModel from "../models/chat.models.js";
import GroupModel from "../models/group.models.js";

io.on("connection", async (socket) => {
  socket.on("send-data-server", async (newData) => {
    let firstuser = newData.user1;
    let seconduser = newData.user2;
    let textdata = newData.textabout;
    const data = await ChatModel.find({
      $or: [
        { user1: firstuser, user2: seconduser },
        { user2: firstuser, user1: seconduser },
      ],
    });

    if (!data || data.length === 0) {
      const CreateData = new ChatModel({
        user1: firstuser,
        user2: seconduser,
        AllChat: [
          {
            textfrom: 0,
            textabout: textdata,
          },
        ],
      });
      await CreateData.save();
    } else {
      let fr = 0;
    
      if (data[0].user1 != firstuser) {
        fr = 1;
      }

      const newd1 = {
        textfrom: fr,
        textabout: textdata,
      };

      await ChatModel.updateOne(
        { _id: data[0]._id },
        { $push: { AllChat: newd1 } }
      );
    }
    const newData2 = {
      firstuser: firstuser,
      seconduser: seconduser,
    };
      const data1 = await ChatModel.find({
        $or: [
          { user1: firstuser, user2: seconduser },
          { user2: firstuser, user1: seconduser },
        ],
      })
     
    socket.emit("send-data-to-client", data1);
  });

  socket.on("id-from-client", async (newData) => {
   
    if (newData) {
      let firstuser = newData.firstuser;
      let seconduser = newData.seconduser;
      const data = await ChatModel.find({
        $or: [
          { user1: firstuser, user2: seconduser },
          { user2: firstuser, user1: seconduser },
        ],
      })
      socket.emit("send-data-to-client", data);
    }
  });
  socket.on('create-new-group',async(data)=>{
    if(data){
      const res = await GroupModel.find({groupname:data.groupname})
      if(res.length>0){
      }
      else{
           const dx = await new GroupModel({
            participant:[data.user],
            groupname:data.groupname
           })
           await dx.save()
           const data1 = await GroupModel.find({},{_id:1,groupname:1})
           socket.emit('second-time',data1)
      }
    }
})
socket.on('group-from-client',async(newdata)=>{
    const data = await GroupModel.find({groupname:newdata.groupname})
    socket.emit('group-data',data)
})
socket.on('first',async()=>{
  const data = await GroupModel.find().select({groupname:1})
  socket.emit('second-time',data)
})
socket.on("send-data-server-group",async(newData)=>{
       (newData)
      const checker = await GroupModel.find({ groupname: newData.groupname });
       (checker);
      
      const participants = checker[0]?.participant;
       ("Participants:", participants);
      
      const c2 = participants?.find(user => user.toString() === newData.user.toString());
       ("c2:", c2);
     
      if(!checker){

      }
      else{
          if(!c2){
            const dp= await GroupModel.findOneAndUpdate({groupname:newData.groupname},{$push:{participant:newData.user}})
          }
          const dpx= await GroupModel.findOneAndUpdate({groupname:newData.groupname},{$push: { AllChat:{textfrom:newData.user,textabout:newData.textabout} }})
      }
      const ned = await GroupModel.find({groupname:newData.groupname})
      socket.emit('group-data',ned)
      socket.broadcast.emit('group-data',ned)
})
});

export { server };
