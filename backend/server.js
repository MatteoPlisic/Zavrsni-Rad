// Load env variables
if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
  }
  
  // Import dependencies
  const express = require("express");
  const cors = require("cors");
  const cookieParser = require("cookie-parser");
  const connectToDb = require("./config/connectToDb");

  //controllers
  const usersController = require("./controllers/usersController");
  const tournamentsController = require("./controllers/tournamentsController");
  const teamsController = require("./controllers/teamsController");
  const playersController = require("./controllers/playersController");
  const requireAuth = require("./middleware/requireAuth");
  const groupsController = require('./controllers/groupsController');
  const schedulesController = require("./controllers/schedulesController")
  const gamesController = require("./controllers/gamesController")
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
  //users
  app.get("/superUser",usersController.checkSuperUser)
  app.post("/signup", usersController.signup);
  app.post("/login", usersController.login);
  app.get("/logout", usersController.logout);
  app.get("/check-auth", requireAuth);

  //tournaments
  app.get("/tournaments/:id",tournamentsController.getTournamentById)
  app.post("/tournaments",tournamentsController.createTournament);
  app.get("/tournaments",tournamentsController.getTournaments);
  app.put("/tournaments/:id",tournamentsController.updateTournament)
  app.get("/my-tournaments",tournamentsController.getTournamentsFromUser)
  app.delete("/my-tournaments/:id",tournamentsController.deleteTournament)
  app.delete("/my-tournaments",tournamentsController.deleteTournament)
  app.post("/tournaments/simulate",tournamentsController.simulateTournament)
  app.get("/tournament/details/:id",tournamentsController.getTournamentDetails)

  //teams
  app.get("/teams",teamsController.getTeams)
  app.get("/teams/:id",teamsController.getTeamById)
  app.post("/teams",teamsController.createTeam)
  app.put("/teams/:id",teamsController.updateTeam)
  app.delete("/teams/:id",teamsController.deleteTeam)


  //players
  app.get("/players",playersController.getAllPlayers)
  app.post("/players",playersController.createPlayer)
  app.delete("/players/:id",playersController.deletePlayer)
  app.get("/players/:id",playersController.getPlayerById)
  app.put("/players/:id",playersController.updatePlayer)


  //groups
  
app.get('/groups', groupsController.getAllGroups);
app.post('/groups', groupsController.createGroup);
app.delete('/groups/:id', groupsController.deleteGroup);
app.get('/groups/:id', groupsController.getGroupById);
app.put('/groups/:id', groupsController.updateGroup);
app.get('/finish-group/:id',groupsController.finishGroup)
//schedule


app.get("/schedule",schedulesController.getSchedules)
app.post("/schedule",schedulesController.createSchedule)
app.get("/schedule/:id",schedulesController.getScheduleById)
app.get("/schedule-finals/:id",schedulesController.generateFinals)



// Create a new game
app.post('/game', gamesController.createGame);

// Get all games
app.get('/game', gamesController.getAllGames);

// Get a single game by ID
app.get('/game/:id', gamesController.getGameById);

// Update a game by ID
app.put('/game/:id', gamesController.updateGameById);

// Delete a game by ID
app.delete('/game/:id', gamesController.deleteGameById);

  // Start our server
  app.listen(process.env.PORT);