// src/components/ProductCard.js
import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Stack
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext'; // ✅ Import useCart hook

const ProductCard = ({ product }) => {
  const { addToCart } = useCart(); // ✅ Get addToCart function from context

  const handleAddToCart = () => {
    const productWithQuantity = { ...product, quantity: 1 };
    addToCart(productWithQuantity); // ✅ Call context function instead of prop
  };

  return (
    <Card sx={{ maxWidth: 345, margin: 2 }}>
      <CardMedia
        component="img"
        height="200"
        image={`http://localhost:5000/${product.image_path}`}
        alt={product.general_name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.general_name}
        </Typography>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          <i>{product.scientific_name}</i>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.brief_description}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          <strong>Uses:</strong> {product.uses}
        </Typography>
        <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
          ${product.cost}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Button
            size="small"
            component={Link}
            to={`/products/${product.id}`}
            variant="outlined"
          >
            View
          </Button>
          <Button
            size="small"
            variant="contained"
            color="success"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
