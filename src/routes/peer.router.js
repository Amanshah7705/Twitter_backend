import { Router } from "express";
import AuthMiddleWare from "../middlewares/auth.middleware.js";
import { Send_Data_To_Backend, Send_Data_to_frontend } from "../controllers/peer.controllers.js";



const PeerRouter = Router()



PeerRouter.route('/add').post(Send_Data_To_Backend)

PeerRouter.route('/get').post(Send_Data_to_frontend)



export default PeerRouter