// src/components/Footer.js
import React from 'react';
import { Container, Typography } from '@mui/material';

const Footer = () => {
  return (
    <footer>
      <Container maxWidth="sm" style={{ padding: '10px 0', textAlign: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          &copy; 2025 Plant E-Commerce. All rights reserved.
        </Typography>
      </Container>
    </footer>
  );
};

export default Footer;
