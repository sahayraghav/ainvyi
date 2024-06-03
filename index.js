const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const cors = require("cors")

const app = express();

app.use(express.json())
app.use(cors())

const port=8000;

mongoose.connect("mongodb://localhost:27017/nutrifit")
.then(()=>{
    console.log("database connected succesfully");
})
.catch((err)=>{
    console.log(err);
})

const usermodel = require("./models/usermodel")
const foodmodel = require("./models/foodmodel")
const trackmodel = require("./models/trackingmodel")
const verifytoken = require("./verifytoken")


//entry point for adding food item
app.post("/enterfood",(req,res)=>{
    const userdata = req.body
    foodmodel.create(userdata)
    .then(()=>{
        res.send({message:"inserted food item"})
    })
    .catch((err)=>{
        console.log(err);
        res.send({message:"could not insert food data due to some error"})
    })
})

//registration endpoint 
app.post("/register",(req,res)=>{
    
    let userdata = req.body
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(userdata.password, salt, async function(err, hash) {
            userdata.password = hash
            try {
                const data = await usermodel.create(userdata)
                res.status(201).send({message: "user registered"})
            } 
            catch (error) {
                console.log(error);
                res.status(500).send({message:"some problem"})
            }
        });
    });
})

//login endpoint 
app.post("/login",async (req,res)=>{
    const userdata = req.body
    try {
        const doc = await usermodel.findOne({email:userdata.email})
        if (doc){
            bcrypt.compare(userdata.password, doc.password, function(err, result) {
                if (!result){
                    res.status(403).send({message:"wrong password"})
                }
                else{
                    const token = jwt.sign({email:userdata.email},"nutrifit")
                    res.send({message:"logged in and token sent",token:token,userid:doc._id,name:doc.name})
                }
            });
        }
        else{
            res.status(404).send({message:"user not found"})
        }
    } 
    catch (error) {
        console.log(error);
        res.status(500).send({message:"some error"})
    }
})

//entry point for getting food items
app.get("/foods",verifytoken, async (req,res)=>{
    try {
        const data = await foodmodel.find();
        res.send(data)
    } catch (error) {
        console.log(error);
        res.status(500).send({message:"some error occured"})
    }
})

app.get("/foods/:name",verifytoken,async (req,res)=>{
    try{
        let foods = await foodmodel.find({name:{$regex:req.params.name,$options:'i'}})
        if(foods.length!==0){
            res.send(foods);
        }
        else {
            res.status(404).send({message:"Food Item Not Fund"})
        } 
    }
    catch(err){
        console.log(err);
        res.status(500).send({message:"Some Problem in getting the food"})
    }
})


//entry point for tracking food
app.post("/track",verifytoken,async (req,res)=>{
    const fooddata = req.body
    try {
        const doc = await trackmodel.create(fooddata)
        res.status(201).send({message:"food added"})
    } catch (error) {
        console.log(error);
        res.status(500).send({message:"some error occured in adding food"})
    }
})

//endpoint to fetch all food eaten by a person
// app.get("/track/:userid",verifytoken,async (req,res)=>{
//     const userID = req.params.userid
//     try {
//         const doc = await trackmodel.find({userid:userID}).populate("userid").populate("foodid")
//         res.send(doc)
//     } catch (error) {
//         console.log(error);
//         res.status(500).send({message:"some error occured"})
//     }
// })

app.get("/track/:userid/:date",async (req,res)=>{
    let userID = req.params.userid;
    let date = new Date(req.params.date);
    let strDate = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
    try
    {
        let foods = await trackmodel.find({userid:userID,eatenDate:strDate}).populate('userid').populate('foodid')
        res.send(foods);
    }
    catch(err)
    {
        console.log(err);
        res.status(500).send({message:"Some Problem in getting the food"})
    }
})

//starting express app
app.listen(port,()=>{
    console.log("port started successfully");
})