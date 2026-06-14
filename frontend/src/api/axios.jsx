import axios from 'axios';

const api = axios.create({
  // otherwise it uses the hardcoded Back4app link.
  baseURL:  'https://stock-qm20yubg.b4a.run/',
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default api;
