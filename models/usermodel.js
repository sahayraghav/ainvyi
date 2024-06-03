const mongoose = require("mongoose")

const userschema = mongoose.Schema({
    "name":{
        type:String,
        required:true
    },
    "email":{
        type:String,
        required:true
    },
    "password":{
        type:String,
        required:true
    },
    "age":{
        type:Number,
        required:true,
        minimum:12
    }
},{timestamps:true})

const usermodel = mongoose.model("users",userschema)

module.exports = usermodel