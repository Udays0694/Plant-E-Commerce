import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000', // Your backend server URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add axios interceptor to handle token expiration globally
axiosInstance.interceptors.response.use(
  response => response,
  async (error) => {
    if (error.response.status === 401) {
      // Handle token expiration (log out user and redirect to login)
      localStorage.removeItem('token');
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

// Fetch products from the backend by category
export const fetchProductsByCategory = async (categoryId) => {
  const response = await axiosInstance.get(`/products/category/${categoryId}`);
  return response.data;
};

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/auth/register', userData); // ✅ Fixed Endpoint
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw new Error(error.response?.data?.message || 'Error registering user.');
  }
};

// Login user and return token (from backend route)
export const loginUser = async (loginData) => {
  try {
    const response = await axiosInstance.post('/auth/login', loginData); // Correct backend login route

    // Store the token in localStorage if login is successful
    const token = response.data.token; // Assuming the token is returned as part of the response data
    if (token) {
      localStorage.setItem('token', token); // Store token in localStorage
    }

    return response.data; // You can return any additional data, like user info if included
  } catch (error) {
    console.error('Error logging in:', error);
    throw new Error(error.response?.data?.message || 'Login failed, please try again.');
  }
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem('token'); // Ensure it matches the key used in `loginUser`
};

// Get User Profile
export const getUserProfile = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('User is not logged in.');
  }

  try {
    const response = await axiosInstance.get('/users/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error('Session expired. Please log in again.');
    }
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Update User Profile (PUT /users/profile)
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
    totalAmount, // Ensure the field name is consistent
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
