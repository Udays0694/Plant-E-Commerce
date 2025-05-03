// src/components/Header.js
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
} from '@mui/material';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = Boolean(localStorage.getItem('token'));
  const [logoutMessage, setLogoutMessage] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleProductsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProductsClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLogoutMessage(true);
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          bgcolor: '#1b1f23',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography
            variant="h5"
            fontWeight="700"
            color="white"
            sx={{
              cursor: 'pointer',
              fontFamily: 'Segoe UI, sans-serif',
              letterSpacing: 1.2,
            }}
            onClick={() => navigate('/')}
          >
            🌿 Plant E-Commerce
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <StyledNavButton to="/" active={isActive('/')}>
              Home
            </StyledNavButton>

            <Button
              color="inherit"
              onClick={handleProductsClick}
              sx={dropdownStyle}
              aria-controls={open ? 'products-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              Products
            </Button>

            <Menu
              id="products-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleProductsClose}
              MenuListProps={{ onMouseLeave: handleProductsClose }}
              PaperProps={{
                sx: {
                  bgcolor: '#2b2f36',
                  color: 'white',
                },
              }}
            >
              {['indoor', 'outdoor', 'aquatic', 'artificial', 'bonsai'].map((type) => (
                <MenuItem
                  key={type}
                  component={Link}
                  to={`/products/${type}`}
                  onClick={handleProductsClose}
                  sx={{ '&:hover': { bgcolor: '#3a3f47' } }}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)} Plants
                </MenuItem>
              ))}
            </Menu>

            <StyledNavButton to="/cart" active={isActive('/cart')}>
              Cart
            </StyledNavButton>

            {isAuthenticated && (
              <StyledNavButton to="/admin" active={isActive('/admin')}>
                Admin Dashboard
              </StyledNavButton>
            )}

            {isAuthenticated ? (
              <>
                <StyledNavButton to="/profile" active={isActive('/profile')}>
                  Profile
                </StyledNavButton>
                <Button
                  onClick={handleLogout}
                  aria-label="Logout"
                  sx={{
                    color: 'white',
                    '&:hover': { color: '#64ffda' },
                    transition: 'color 0.2s ease-in-out',
                    textTransform: 'none',
                    fontSize: '1rem',
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <StyledNavButton to="/register" active={isActive('/register')}>
                  Register
                </StyledNavButton>
                <StyledNavButton to="/login" active={isActive('/login')}>
                  Login
                </StyledNavButton>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Snackbar
        open={logoutMessage}
        autoHideDuration={2000}
        onClose={() => setLogoutMessage(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setLogoutMessage(false)}
          severity="success"
          variant="filled"
        >
          Logout successful!
        </Alert>
      </Snackbar>
    </>
  );
};

const StyledNavButton = ({ to, active, children }) => (
  <Button
    component={Link}
    to={to}
    sx={{
      color: active ? '#64ffda' : 'white',
      fontWeight: active ? 'bold' : 'normal',
      textTransform: 'none',
      fontSize: '1rem',
      '&:hover': {
        color: '#64ffda',
        backgroundColor: 'transparent',
      },
      transition: 'color 0.2s ease-in-out',
    }}
  >
    {children}
  </Button>
);

const dropdownStyle = {
  color: 'white',
  textTransform: 'none',
  '&:hover': {
    color: '#64ffda',
    backgroundColor: 'transparent',
  },
  transition: 'color 0.2s ease-in-out',
};

export default Header;
