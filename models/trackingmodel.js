const mongoose = require("mongoose")

const trackschema = mongoose.Schema({
    "userid":{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    "foodid":{
        type:mongoose.Schema.Types.ObjectId,
        ref:"foods",
        required:true
    },
    details:{
       
        calories:Number,
        protein:Number,
        carbohydrates:Number,
        fat:Number,
        fiber:Number,
       
    },
    "eatenDate":{
        type:String,
        default:new Date().toLocaleDateString()
    },
    "quantity":{
        type:Number,
        required:true,
        minimum:1
    }
},{timestamps:true})

const trackmodel = mongoose.model("tracks",trackschema);

module.exports = trackmodel