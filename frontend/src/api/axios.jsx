import axios from 'axios';

const api = axios.create({
  // otherwise it uses the hardcoded Back4app link.
  baseURL:  'https://stock-16wbdco1.b4a.run/',
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;
