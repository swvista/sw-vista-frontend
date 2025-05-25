// src/services/axiosClient.js
import axios from 'axios';
import Constants from './constants';

const axiosClient = axios.create({
  baseURL: Constants.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Optional: handle global response errors
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 (unauthorized) globally
    if (error.response?.status === 401) {
      console.warn('Unauthorized, redirecting to login...');
      // Optional: logout or redirect logic
    }
    else if(error.response?.status ==403){
        console.log("Forbidden (CSRF cookie not set.)")
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
