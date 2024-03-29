import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import LoginPage from '../pages/LoginPage/LoginPage';
import SignupPage from '../pages/SignupPage/SignupPage';
import FrontPage from '../pages/FrontPage/FrontPage';
import Navbar from './Navbar';

import AllTournamentsPage from '../pages/AllTournaments/AllTournamentsPage';

import MyTournamentspage from '../pages/MyTournaments/MyTournamentspage';
import CreateTournamentPage from '../pages/CreateTournamentPage/CreateTournamentPage';
import EditTournamentPage from '../pages/EditTournamentPage/EditTournamentPage';
import  SingleTournamentPage from '../pages/SingleTournamentPage/SingleTournamentPage';
import AdministrationPage from '../pages/AdministrationPage/AdministrationsPage';
import EditTeamPage from '../pages/EditTeamPage/EditTeamPage';
import EditPlayerPage from '../pages/EditPlayerPage/EditPlayerPage';
import { EditGamePage } from '../pages/EditGamePage/EditGamePage';
import './App.css'; // Add this line at the top
import EditUserpage from '../pages/EditUserPage/EditUserPage';

axios.defaults.baseURL = 'http://localhost:3000/';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar isLoggedIn={isLoggedIn} />

        <Routes>
          <Route path="/" element={<FrontPage />} />
          <Route
            path="/login"
            element={<LoginPage setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />}
          />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/tournaments" element={<AllTournamentsPage />} />
          <Route path="/my-tournaments" element={<MyTournamentspage />} />
          <Route path="/create-tournament" element={<CreateTournamentPage />} />
          <Route path="/edit-tournament/:id" element={<EditTournamentPage />} />
          <Route path="/tournament-details/:id" element={<SingleTournamentPage/>}/>
          <Route path='/administration' element={<AdministrationPage/>}></Route>
          <Route path='/edit-team/:id' element={<EditTeamPage/>}></Route>
          <Route path='/edit-player/:id' element={<EditPlayerPage/>}></Route>
          <Route path='/edit-game/:id' element ={<EditGamePage/>}></Route>
          <Route path='/edit-user/:id' element ={<EditUserpage/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
