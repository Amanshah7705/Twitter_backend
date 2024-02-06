import PeerModel from "../models/peers.models.js";
import APIERROR from "../utils/apierror.js";
import APIRESPONCE from "../utils/apiresponce.js";
import HandleMiddleware from "../utils/handlemiddleware.js";


const Send_Data_To_Backend = HandleMiddleware(async(req,res,next)=>{
      try {
        const {myid,mypeerid} = req.body
  
        const data = await PeerModel.find({UserId : myid})
        // console.log(data)
        if(data.length===0){
             const newdata = new PeerModel({
              UserId:myid,
              PeerId:mypeerid
             })
             await newdata.save()
        }
        else{
            await PeerModel.findOneAndUpdate(
                { UserId: myid.current }, // Assuming myid.current holds the user ID
                { $set: { PeerId: mypeerid } },
               
              );
              
        }
        res.status(200).json(new APIRESPONCE(200,"All done"))
      } catch (error) {
        throw new APIERROR(500,"error occur at  groupcall part",error) 
      }
})

const Send_Data_to_frontend = HandleMiddleware(async(req,res,next)=>{
    try {
        const {friendid} = req.body
        const data = await PeerModel.find({UserId:friendid})
        //  console.log(data)
        if(data.length>0){
            res.status(200).json(new APIRESPONCE(200,"Your Friend Id",data))
        }
        else{
            throw new APIERROR(500,"users does not exist",)
        }
    } catch (error) {
         throw new APIERROR(500,"error occur at groupcall part",error)
    }
})

export {Send_Data_To_Backend,Send_Data_to_frontend}
