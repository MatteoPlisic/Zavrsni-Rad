import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useGlobalState } from 'use-global-state-react';
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const Navbar = () => {
  const handleLogout = async (e) => {
    e.preventDefault();
    console.log(isLoggedIn)
    try {
      const res = await axios.get('/logout', { withCredentials: true });
      const token = res.data.token;
      const cookieOptions = {
        expires: 30,
        httpOnly: true,
        sameSite: "none",
        secure: process.env.NODE_ENV === "production",
      };

      console.log(token);
      Cookies.remove('Authorization');
      setIsLoggedIn(false)
     
       
    } catch (err) {
      console.error(err);
    }
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/check-auth', {
          withCredentials: true,
          headers: {
            Cookie: `Authorization=${Cookies.get('Authorization')}`
          }
        });
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error checking auth:', error);
      }
    };

    checkAuth();
  });


  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Mini football
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        {isLoggedIn ? (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/signup">
              Signup
            </Button>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
