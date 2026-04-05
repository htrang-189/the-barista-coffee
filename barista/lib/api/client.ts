import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_CONFIG } from './constants';

// Use current origin in browser, localhost:3000 in development
const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    // Browser environment - use current origin
    return '';
  }
  // Server environment - use full URL
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
};

const baseURL = getBaseURL();

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use((config) => {
  // Add any auth headers if needed
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError) => {
    const message = (error.response?.data as any)?.message || error.message;
    return Promise.reject({
      status: error.response?.status,
      message,
      data: error.response?.data,
    });
  }
);

export default apiClient;
