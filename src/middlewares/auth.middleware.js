
import UserMainModel from '../models/users.models.js'
import APIERROR from '../utils/apierror.js'
import  HandleMiddleware from '../utils/handlemiddleware.js'
import jwt from 'jsonwebtoken'
const AuthMiddleWare = HandleMiddleware(async(req,res,next)=>{
     try {
        const token = req.cookies?.accessToken
        if(!token){
            throw new APIERROR(501,"Token not exist",)
        }
        const match = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        if(!match){
           throw new APIERROR(501,"Unauthorized",)
        }
        const checker = await UserMainModel.findOne({email:match.email},{password:0})
        if(!checker){
           throw new APIERROR(501,"User does not exist",)
        }
        req.user = checker
        next()
     } catch (error) {
         throw new APIERROR(501,"error occur at middleware part",error.errors)
     }
})

export default AuthMiddleWare