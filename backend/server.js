// Load env variables
if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
  }
  
  // Import dependencies
  const express = require("express");
  const cors = require("cors");
  const cookieParser = require("cookie-parser");
  const connectToDb = require("./config/connectToDb");

  const usersController = require("./controllers/usersController");
  const tournamentsController = require("./controllers/tournamentsController");
  const requireAuth = require("./middleware/requireAuth");
  
  // Create an express app
  const app = express();
  
  // Configure express app
  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
  
  // Connect to database
  connectToDb();
  
  // Routing
  app.post("/signup", usersController.signup);
  app.post("/login", usersController.login);
  app.get("/logout", usersController.logout);
  app.get("/check-auth", requireAuth);
  app.post("/tournaments",tournamentsController.createTournament);
  app.get("/tournaments",tournamentsController.getTournaments);
  // Start our server
  app.listen(process.env.PORT);