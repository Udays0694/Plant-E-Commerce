// src/pages/AdminDashboard.js
import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" align="center">
          Admin Dashboard
        </Typography>
        <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
          Manage your store's users, products, and orders from one central place.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Manage Products
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => handleNavigation('/admin/products')}
              >
                View Products
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Manage Users
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={() => handleNavigation('/admin/users')}
              >
                View Users
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Manage Orders
              </Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: '#388e3c',
                  '&:hover': { backgroundColor: '#2e7d32' },
                }}
                fullWidth
                onClick={() => handleNavigation('/admin/orders')}
              >
                View Orders
              </Button>
            </Paper>
          </Grid>
        </Grid>

        <Box mt={4} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            Need help? Contact support at <strong>admin@plantshop.com</strong>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;
