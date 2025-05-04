import axios from 'axios';

// Determine baseURL based on environment
const baseURL =
  process.env.NODE_ENV === 'production'
    ? 'https://plant-e-commerce-production.up.railway.app' // Production backend
    : 'http://localhost:5000'; // Local development backend

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Axios interceptor to handle token expiration globally
axiosInstance.interceptors.response.use(
  response => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

// Fetch products by category
export const fetchProductsByCategory = async (categoryId) => {
  const response = await axiosInstance.get(`/products/category/${categoryId}`);
  return response.data;
};

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw new Error(error.response?.data?.message || 'Error registering user.');
  }
};

// Login user and store token
export const loginUser = async (loginData) => {
  try {
    const response = await axiosInstance.post('/auth/login', loginData);
    const token = response.data.token;

    if (token) {
      localStorage.setItem('token', token);
    }

    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw new Error(error.response?.data?.message || 'Login failed, please try again.');
  }
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem('token');
};

// Get user profile
export const getUserProfile = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('User is not logged in.');

  try {
    const response = await axiosInstance.get('/users/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Session expired. Please log in again.');
    }
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (token, updatedProfile) => {
  try {
    const response = await axiosInstance.put('/users/profile', updatedProfile, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw new Error('Error updating profile.');
  }
};

// Place an order
export const placeOrder = async (userId, cartItems, totalAmount) => {
  const token = localStorage.getItem('token');

  const orderPayload = {
    userId,
    productIdWithQuantity: cartItems.map(item => ({
      productId: item.id,
      quantity: item.quantity,
    })),
    totalAmount,
  };

  try {
    const response = await axiosInstance.post('/orders/place', orderPayload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error placing order:', error);
    throw new Error(error.response?.data?.message || 'Error placing order.');
  }
};

export default axiosInstance;
