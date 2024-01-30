import mongoose from "mongoose";

import bcrypt from 'bcryptjs'

const UserMainSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
        trim:true,
    },
    refresh_token:{
        type:String,
        default:null
    }
})

const UserMainModel = mongoose.model('UserMainModel',UserMainSchema)

export default UserMainModel