if(process.env.NODE_ENV != 'production'){
    require("dotenv").config();
    }
    //Dependencies
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectToDb = require("./config/connectToDb");

const usersController = require('./controllers/usersController');
//const requireAuth = require("./middleware/requireAuth");
    //Create express appp
    const app = express();
    //app.use(cookieParser());
    app.use(express.json());
    
    connectToDb()
    
    //Routing
    app.get('/',(req,res) =>{
         
    })
    app.post("/signup", usersController.signup);

    
    //Routing
    app.listen(process.env.PORT);