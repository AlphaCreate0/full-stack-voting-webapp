import React, { useState } from 'react';
import {
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';
import './RegisterPageStyles.css';
import axios from 'axios';

const RegisterPage = ({ onRegister, setIsRegisterPage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [region, setRegion] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleRegionChange = (event) => {
    setRegion(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/auth/register', {
        username,
        password,
        email,
        region
      });
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('API error:', error);
    }
  };

  const handleCloseDialog = () => {
    setShowSuccessDialog(false);
    setIsRegisterPage(false);
    navigate('/');
  }

  return (
    <Grid container component="main" className="register-root">
      <Grid item xs={12} sm={8} md={6} component={Paper} elevation={0} square borderRadius={5} boxShadow={15}>
        <div className="register-paper">
          <Typography component="h1" variant="h4" paddingTop={1} fontWeight="bold" letterSpacing={1}>
            Register new user
          </Typography>
          <form className="register-form" onSubmit={handleSubmit}>
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
              autoComplete="new-password"
              value={password}
              onChange={handlePasswordChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="email"
              label="Email Address"
              type="email"
              id="email"
              autoComplete="email"
              value={email}
              onChange={handleEmailChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="region"
              label="Region"
              id="region"
              value={region}
              onChange={handleRegionChange}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="register-submit"
              sx={{ width: '180px', marginLeft: '90px', marginTop: '10px' }}
            >
              Create new user
            </Button>
          </form>
        </div>
      </Grid>
      <Dialog open={showSuccessDialog} onClose={handleCloseDialog}>
        <DialogTitle>User Created</DialogTitle>
        <DialogContent>
          <DialogContentText> User has been created successfully! You will now be redirected to the login page.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default RegisterPage;