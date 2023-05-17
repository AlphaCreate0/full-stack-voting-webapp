import React, { useState } from 'react';
import {
  Grid,
  Paper,
  TextField,
  Button,
  Typography
} from '@mui/material';
import './LoginPageStyles.css';
import {Navigate, useNavigate}  from 'react-router-dom';
import axios from 'axios';
import { WidthNormal } from '@mui/icons-material';

const LoginPage = ({ onLoginSuccess, setIsLoginPage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/authenticate', {
        username,
        password
      });
      const jwtToken = response.data.jwtToken
      localStorage.setItem('jwtToken', jwtToken);

      console.log('API response:', response.data);
      // Handle successful authentication
      setAuthenticated(true);
      // Redirect to candidates
      onLoginSuccess();
    } catch (error) {
      console.error('API error:', error);
      // Handle error during authentication
      setError(error.message);
    }
  };

  const handleRegister = () => {
    setIsLoginPage(false);
    navigate('/register');
  };

  return (
    <Grid container component="main" className="login-root" justifyContent="space-around">
      <Typography variant="h2" component="h3" align="left" gutterBottom>
        VOTING APPLICATION
      </Typography>
      <Grid item xs={16} sm={12} md={5} component={Paper} elevation={0} square borderRadius={5} boxShadow={15}>
        <div className="login-paper">
          <Typography component="h1" variant="h5" paddingTop={1} fontWeight='bold' letterSpacing={2}>
            Login
          </Typography>
          <form className="login-form" onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={handleUsernameChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
            />
            <Button
              display='flex'
              justifyContent="space-between"
              type="submit"
              variant="contained"
              color="primary"
              className="login-submit"
              sx={{width: "110px", marginLeft: "50px", marginTop: "20px"}}
            >
              Sign In
            </Button>
            <Button
              variant="text"
              color="secondary"
              onClick={handleRegister}
              sx={{ marginTop: '20px', float: 'right', marginRight: "50px"}}
            >
              Register
            </Button>
          </form>
        </div>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
