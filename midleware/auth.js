const jwt = require("jsonwebtoken");
const {User} = require('../Model/User');

module.exports = async function (req,res,next){
    const token = req.header("x-token");
    if(!token) return res.json( {"res":"error","message":"Access denied. No token provided."} );

    try{
        let id = jwt.verify(token,"jwtPrivateKey").id;
        let user = await User.findById(id);
        if(user){
            req.userId = id;
            next();
        }else{
            return res.json( {"res":"error","message":"That user is deleted."} );
        }
        
    }catch(e){
        return res.json( {"res":"error","message":"Invalid token."} );
    }
} 

