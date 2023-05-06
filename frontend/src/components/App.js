import { useState, useEffect } from "react";
import axios from "axios";
import {BrowserRouter,Link,Route,Routes} from "react-router-dom"
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import FrontPage from "../pages/FrontPage";
import Navbar from "./Navbar";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Navbar/>
        <Routes>
          
          <Route index element={<FrontPage/>} />
          <Route path="/" element={<FrontPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/signup" element={<SignupPage/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
