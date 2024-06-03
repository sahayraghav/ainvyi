const jwt = require("jsonwebtoken")

function verifytoken(req,res,next){

    if (req.headers.authorization!==undefined){
        const token = req.headers.authorization.split(" ")[1]
        jwt.verify(token,"nutrifit",(err,data)=>{
            if (!err){
                next()
            }
            else{
                res.status(403).send({message:"please send the correct token"})
            }
        })
    }
    else{
        res.send({message:"please send token"})
    }
}

module.exports = verifytoken