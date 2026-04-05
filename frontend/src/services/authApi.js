import axiosClient from './axiosClient';

export const authApi = {
  login: async (credentials) => {
    const response = await axiosClient.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (userData) => {
    const response = await axiosClient.post('/auth/register', userData);
    return response.data;
  },

  verify: async () => {
    const response = await axiosClient.get('/auth/verify');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await axiosClient.patch('/auth/profile', profileData);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await axiosClient.post('/auth/change-password', passwordData);
    return response.data;
  }
};
