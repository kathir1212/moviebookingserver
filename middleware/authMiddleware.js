 

 const userModel = require('../models/movieusers')
 const jwt = require('jsonwebtoken')
 const auth = async(req,res,next) => {
    console.log("middleware");
    
try{
    let token;

    console.log(req.headers.authorization,"req.headers.authorization");
    console.log(req.headers.authorization.startsWith('Bearer'),"req.headers.authorization.startsWith('Bearer')");
    
    

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
console.log("if condition");

try{

    token = req.headers.authorization.split(' ')[1];
    console.log(token,"token>>>>>>");
    
    console.log(jwt.verify(token, process.env.JWT_SECRET),"decode>>>>>");
 
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    

   req.user = await userModel.findById(decode.id).select('-password');
   
next();
}
catch(err){
    return res.status(401).json({err : 'not Autorized, wrong' })
}


if(!token){
    return res.status(401).json({msg: "not Authorized"})
}
}

}
catch(err){
    console.log(err);
    
}
  
 }


 module.exports = auth;