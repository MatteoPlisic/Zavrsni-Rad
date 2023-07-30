import { AppBar, Button, Toolbar, Typography, ListItemText, ListItem } from "@mui/material";
import { Link } from "react-router-dom";
import { useGlobalState } from 'use-global-state-react';
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import CheckAuth from "./CheckAuth";
import CheckNonAuth from "./CheckNonAuth";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSuperUser, setisSuperUser] = useState(false)

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
      window.location.reload(false);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {

    async function checkSuperUser() {
      const superUser = await axios.get('/superUser', { withCredentials: true })
      console.log(superUser)
      if (superUser.status === 200)
        setisSuperUser(true)
    }
    checkSuperUser()
  }, [])




  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Mini football
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/tournaments">
          Tournaments
        </Button>
        <CheckAuth>
          <Button color="inherit" component={Link} to="/my-tournaments">
            My Tournaments
          </Button>
          <Button color="inherit" component={Link} to="/create-tournament">
            Create tournament
          </Button>
          {isSuperUser && 
           <Button color="inherit" component={Link} to="/administration">
           Administration
         </Button>
         }
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>

        </CheckAuth>
        <CheckNonAuth>
          <Button color="inherit" component={Link} to="/signup">
            Signup
          </Button>
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        </CheckNonAuth>

      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
