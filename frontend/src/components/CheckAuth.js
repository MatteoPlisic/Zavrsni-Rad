import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const CheckAuth = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
      async function checkAuthentication () {
        try {
          const res = await axios.get('/check-auth', { withCredentials: true });
          // Assuming the response contains an 'isLoggedIn' property
            if(res.data === "OK")
                setIsLoggedIn(true);
            else
                setIsLoggedIn(false);
          console.log(res.data)
          // Update the isLoggedIn state in the parent component
         // return children;
        } catch (error) {
          setIsLoggedIn(false)
        }
      };
  
      checkAuthentication();
    },[]);
  
    if(isLoggedIn)
    return children;
    
    
    
    
  };
  
  export default CheckAuth;