import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
} from '@mui/material';

const EditUserpage = () => {
  const { id } = useParams();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [isSuperUser, setIsSuperUser] = useState(false)
  const navigate = useNavigate('');

  useEffect(() => {
    fetchUserData();
  }, []);

  async function fetchUserData() {
    try {
        console.log(id)
      const response = await axios.get(`/users/${id}`, { withCredentials: true });
      console.log(response)
      const userData = response.data;
      setUserName(userData.name);
      setUserEmail(userData.email);
      setIsSuperUser(userData.superUser)
      setUserPassword(userData.password)
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  const handleUpdateSuperUser = async () => {
    try {
      await axios.put(`/users/${id}`, {
        superUser: isSuperUser,
        name: null,
        email: null,
        password: null,
      }, { withCredentials: true });

      navigate('/administration')
    } catch (error) {
      console.error('Error updating superuser:', error);
    }
  };

  const handleUpdateName = async () => {
    try {
      await axios.put(`/users/${id}`, {
        name: userName,
        email: null,
        password: null,
        SuperUser: null,
      }, { withCredentials: true });

      navigate('/administration')
    } catch (error) {
      console.error('Error updating name:', error);
    }
  };

  const handleUpdateEmail = async () => {
    try {
      await axios.put(`/users/${id}`, {
        email: userEmail,
        name: null,
        password: null,
        SuperUser: null,
      }, { withCredentials: true });

      navigate('/administration')
    } catch (error) {
      console.error('Error updating email:', error);
    }
  };

  const handleUpdatePassword = async () => {
    try {
      await axios.put(`/users/${id}`, {
        password: userPassword,
        name: null,
        email: null,
        SuperUser: null,
      }, { withCredentials: true });

      navigate('/administration')
    } catch (error) {
      console.error('Error updating password:', error);
    }
  };

  return (
    <Box p={3} marginTop={"50px"}>
      <Typography variant="h4" gutterBottom>
        Edit User
      </Typography>

      <Box mt={3}>
        <TextField
          label="Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          variant="outlined"
          size="small"
          fullWidth
          margin="dense"
        />
        <Button variant="contained" color="primary" onClick={handleUpdateName}>
          Update Name
        </Button>
      </Box>

      <Box mt={3}>
        <TextField
          label="Email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          variant="outlined"
          size="small"
          fullWidth
          margin="dense"
        />
        <Button variant="contained" color="primary" onClick={handleUpdateEmail}>
          Update Email
        </Button>
      </Box>

      <Box mt={3}>
        <TextField
          label="New Password"
          value={userPassword}
          onChange={(e) => setUserPassword(e.target.value)}
          variant="outlined"
          size="small"
          fullWidth
          margin="dense"
          type="password"
        />
        <Button variant="contained" color="primary" onClick={handleUpdatePassword}>
          Update Password
        </Button>
      </Box>

      <Box mt={3}>
      <Typography variant="h6" gutterBottom>
          Admin Privileges
        </Typography>
        <Checkbox
          checked={isSuperUser}
          onChange={(e) => setIsSuperUser(e.target.checked)}
          color="primary"
        />
        <Button variant="contained" color="primary" onClick={handleUpdateSuperUser}>
          Update admin privileges
        </Button>
      </Box>
    </Box>
  );
};

export default EditUserpage;
