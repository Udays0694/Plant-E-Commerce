// src/pages/ProductPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../services/api';
import { Container, Typography, Button, Grid } from '@mui/material';

const ProductPage = ({ onAddToCart }) => {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axiosInstance.get(`/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product', error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    const productWithQuantity = {
      ...product,
      quantity: 1
    };
    onAddToCart(productWithQuantity); // Send it to the cart
  };

  if (!product) return <Typography>Loading...</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <img
            src={`http://plant-e-commerce-production.up.railway.app/${product.image_path}`}
            alt={product.general_name}
            style={{ width: '100%', borderRadius: '10px' }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>
            {product.general_name}
          </Typography>
          <Typography variant="subtitle1" gutterBottom color="textSecondary">
            <i>{product.scientific_name}</i>
          </Typography>
          <Typography variant="body1" paragraph>
            {product.brief_description}
          </Typography>
          <Typography variant="body2" paragraph>
            <strong>Uses:</strong> {product.uses}
          </Typography>
          <Typography variant="h5" color="primary" sx={{ my: 2 }}>
            ${product.cost}
          </Typography>
          <Button variant="contained" color="success" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductPage;

