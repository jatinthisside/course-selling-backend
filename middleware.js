const jwt = require('jsonwebtoken');
require('dotenv').config();
exports.auth=async(req,res,next)=>{
   try{
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({
            success:false,
            message:'This route is private, login to access this route!'
        })
    }
    const user = jwt.verify(token,process.env.JWT_SECRET);
    console.log('verified user -> ',user);
    if(!user){
        return res.status(401).json({
            success:false,
            message:'Unable to verify token'
        })
    }
    req.user = user;
    next();
   }catch(e){
     return res.status(500).json({
        success: false,
        message:"Error while authenticating token!"
     })
   }
}