// src/pages/RegistrationPage.js
import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

const RegistrationPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setError('All fields are required');
      return;
    }

    try {
      const response = await registerUser({ username, email, password });
      if (response.success) {
        navigate('/login');
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
          Create an Account
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            margin="normal"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
          />
          {error && (
            <Alert severity="error" sx={{ marginTop: 2 }}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ marginTop: 3, backgroundColor: '#388e3c', '&:hover': { backgroundColor: '#2e7d32' } }}
          >
            Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegistrationPage;
