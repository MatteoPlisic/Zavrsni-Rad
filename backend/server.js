if(process.env.NODE_ENV != 'production'){
    require("dotenv").config();
    }
    //Dependencies
    const express = require('express');
    const connectToDb = require('./config/connectToDb');
    //const cors = require("cors")
    
    //Create express appp
    const app = express();
    //app.use(cookieParser());
    app.use(express.json());
    
    connectToDb()
    
    //Routing
    app.get('/',(req,res) =>{
         
    })
    
    //Routing
    app.listen(process.env.PORT);