import axios from 'axios';

// Configure standard API
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add a request interceptor to append the token
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('kisanMitraUser');
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      if (parsedUser && parsedUser.token) {
        config.headers.Authorization = `Bearer ${parsedUser.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
