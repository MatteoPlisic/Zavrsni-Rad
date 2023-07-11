import React, { useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const CheckAuth = () => {
  useEffect(() => {
    const checkAuthentication = async () => {
        console.log(Cookies.get('Authorization'))
        console.log(Cookies.get("Authorization"))
      try {
        const res = await axios.get('/check-auth', {
            headers: {
                Cookie: `Authorization=${Cookies.get("Authorization")}`,
                SameSite: null
            },
          });
          
    
      } catch (error) {
        // Error occurred, do nothing
      }
    };

    checkAuthentication();
  }, []);

  return <></>;
};

export default CheckAuth;
