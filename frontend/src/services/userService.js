import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const userService = {
  getProfile: async () => {
    const response = await axios.get(`${API_URL}/users/me`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },
  
  updateProfile: async (data) => {
    const response = await axios.patch(`${API_URL}/users/update-me`, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  changePassword: async (data) => {
    const response = await axios.put(`${API_URL}/users/change-password`, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },
};
