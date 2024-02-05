import http from "http";
import { Server } from "socket.io";
import { app } from "../app.js";
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
  },
});

import GroupModel from "../models/group.models.js";

io.on("connection", async (socket) => {
    socket.on('create-new-group',async(data)=>{
      
        if(data){
          const res = await GroupModel.find({groupname:data.groupname})
          
          if(res.length>0){
               await GroupModel.updateOne({_id:res._id},{ $push: { participant:data.user } })
          }
          else{
               const dx = await new GroupModel({
                participant:[data.user],
                groupname:data.groupname
               })
               await dx.save()
          }
        }
        const data1 = await GroupModel.find({},{_id:1,groupname:1})
        socket.emit('second-time',data1)
    })
    socket.on('group-from-client',async(newdata)=>{
        const data = await GroupModel.find({groupname:newdata.groupname})
        socket.emit('group-data',data)
    })
    socket.on('first-time',async()=>{
      const data = await GroupModel.find({},{_id:1,groupname:1})
      socket.emit('second-time',data)
    })
    socket.on("send-data-server-group",async(newData)=>{
          const checker = await GroupModel.find({groupname:newData.groupname})
    })
  });

export {server}