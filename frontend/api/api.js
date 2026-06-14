import axios from 'axios';

const api = axios.create({
  // otherwise it uses the hardcoded Back4app link.
  baseURL:  'https://stock-wx5f2ofa.b4a.run/',
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;
