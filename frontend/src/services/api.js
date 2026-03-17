import axios from 'axios';

// Configure standard API
const getBaseURL = () => {
  const url = import.meta.env.API_URL || '/api';
  // If it's a full URL and doesn't end with /api, append it
  if (url.startsWith('http') && !url.endsWith('/api')) {
    return url.endsWith('/') ? `${url}api` : `${url}/api`;
  }
  return url;
};

const api = axios.create({
  baseURL: getBaseURL(),
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
