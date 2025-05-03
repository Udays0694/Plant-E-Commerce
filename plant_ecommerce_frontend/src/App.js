// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard'; // Import AdminDashboard
import { fetchProductsByCategory } from './services/api';
import IndoorPlants from './pages/IndoorPlants';
import OutdoorPlants from './pages/OutdoorPlants';
import AquaticPlants from './pages/AquaticPlants';
import ArtificialPlants from './pages/ArtificialPlants';
import BonsaiPlants from './pages/BonsaiPlants';
import { CartProvider } from './contexts/CartContext'; // ✅ Import CartProvider

const App = () => {
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token')); // ✅ Track login state

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsData = await fetchProductsByCategory();
        setProducts(productsData);
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };

    loadProducts();
  }, []);

  return (
    <CartProvider> {/* ✅ Wrap entire app with CartProvider */}
      <Router>
        <Header />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage products={products} />} />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage setToken={setToken} />} />

          {/* Protected Routes */}
          {token && (
            <>
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} /> {/* Admin Route */}
            </>
          )}

          {/* Category Routes */}
          <Route path="/products/indoor" element={<IndoorPlants />} />
          <Route path="/products/outdoor" element={<OutdoorPlants />} />
          <Route path="/products/aquatic" element={<AquaticPlants />} />
          <Route path="/products/artificial" element={<ArtificialPlants />} />
          <Route path="/products/bonsai" element={<BonsaiPlants />} />
        </Routes>
        <Footer />
      </Router>
    </CartProvider>
  );
};

export default App;
