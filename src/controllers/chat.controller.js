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

io.on("connection", async (socket) => {
  socket.on("join-room", async (roomId) => {
    socket.join(roomId);
  });
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
      let fr = 1;
      if (data[0].user1 !== firstuser) {
        fr = 0;
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
    socket.emit("id-from-client", newData2);
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
      }).sort({ createdAt: -1 });

      socket.emit("send-data-to-client", data);
    }
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

export { server };
