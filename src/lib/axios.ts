import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

// Interceptor to handle request headers
// This interceptor will attach the authentication token to every request if it exists in localStorage
api.interceptors.request.use( config => {
  const token = localStorage.getItem('AUTH_TOKEN');
  if(token){
    config.headers.Authorization = `Bearer ${token}`; // Attach the token to the request headers
  }
  return config;
})

export default api;