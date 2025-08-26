// Environment configuration for client
const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  CLIENT_URL: import.meta.env.VITE_CLIENT_URL || 'http://localhost:5173'
};

export default config;
