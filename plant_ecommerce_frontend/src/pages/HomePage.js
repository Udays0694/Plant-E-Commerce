// src/pages/HomePage.js
import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
} from '@mui/material';
import ProductCard from '../components/ProductCard';

const HomePage = ({ products }) => {
  return (
    <div>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(to right, #a8edea, #fed6e3)',
          padding: '60px 0',
          textAlign: 'center',
        }}
      >
        <Container>
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            Welcome to Plant E-Commerce 🌿
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Discover fresh greens to breathe life into your home and office.
          </Typography>
          <Button
            variant="contained"
            sx={{ marginTop: 3, backgroundColor: '#388e3c', '&:hover': { backgroundColor: '#2e7d32' } }}
          >
            Shop Now
          </Button>
        </Container>
      </Box>

      {/* Product Listing */}
      <Container sx={{ marginTop: 5 }}>
        <Typography variant="h4" gutterBottom>
        </Typography>
        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default HomePage;

