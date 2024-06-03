const mongoose = require("mongoose")

const foodschema = mongoose.Schema({
    "name":{
        type:String,
        required:true
    },
    "calories":{
        type:Number,
        required:true
    },
    "protein":{
        type:Number,
        required:true
    },
    "carbohydrates":{
        type:Number,
        required:true
    },
    "fat":{
        type:Number,
        required:true
    },
    "fiber":{
        type:Number,
        required:true
    }
},{timestamps:true})

const foodmodel = mongoose.model("foods",foodschema)

module.exports = foodmodel