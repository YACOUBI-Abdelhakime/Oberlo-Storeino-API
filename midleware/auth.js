const jwt = require("jsonwebtoken");

module.exports = function (req,res,next){
    const token = req.header("x-token");
    if(!token) return res.status(401).send("Access denied. No token provided.");

    try{
        req.userId = jwt.verify(token,"jwtPrivateKey").id;
        next();
    }catch(e){
        return res.status(400).send("Invalid token.");
    }
}

