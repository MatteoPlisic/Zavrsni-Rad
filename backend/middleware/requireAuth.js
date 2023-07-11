const jwt = require("jsonwebtoken");
const User = require("../models/user");
const cookieParser = require('cookie-parser');

async function requireAuth(req, res, next) {
  
  try {
    // Read token off cookies
    const token = req.cookies.Authorization;
    console.log(token);
   // console.log(token + "   ASD");
    // Decode the token
    if(token === undefined){
      return res.sendStatus(401);
    }
    else{
    const decoded = jwt.verify(token, process.env.SECRET);
    
    //console.log(token)
    // Check expiration
    if (Date.now() > decoded.exp) return res.sendStatus(401);
    
    // Find user using decoded sub
    const user = await User.findById(decoded.sub);
    if (!user) return res.sendStatus(401);

    // attach user to req
    req.user = user;
   
    // continue on
    return res.sendStatus(200);
    }
  } catch (err) {
    console.log(err)
  }
}

module.exports = requireAuth;