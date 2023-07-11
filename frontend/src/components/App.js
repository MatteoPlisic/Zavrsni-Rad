import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import FrontPage from "../pages/FrontPage";
import Navbar from "./Navbar";
import CheckAuth from "./CheckAuth";

axios.defaults.baseURL = 'http://localhost:3000/';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar isLoggedIn={isLoggedIn} />
       
        <Routes>
          <Route path="/" element={<FrontPage />} />
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
