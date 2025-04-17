
import axios from 'axios';
import { toast } from '@/hooks/use-toast';

// Define API base URL from localStorage if available, otherwise use environment variable
const API_BASE_URL = localStorage.getItem('api_base_url') || 
  import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  // Add timeout to prevent long waiting periods
  timeout: 10000, 
});

// Request interceptor to add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // For development purposes - enable mock login if server is not available
    if (error.code === 'ERR_NETWORK' && error.config?.url === '/api/auth/login') {
      const { email, password } = JSON.parse(error.config.data);
      
      // Check if using demo credentials
      if (email === 'admin@example.com' && password === 'password123') {
        console.log('Using mock login for development');
        
        // Create mock response
        const mockUser = {
          id: 'mock-user-id',
          email: email,
          firstname: 'Admin',
          lastname: 'User',
          role: 'admin'
        };
        
        const mockToken = 'mock-jwt-token';
        localStorage.setItem('auth_token', mockToken);
        
        // Redirect to dashboard after short delay
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 500);
        
        // Return mock response to prevent error
        return Promise.resolve({ 
          data: { 
            token: mockToken, 
            user: mockUser 
          } 
        });
      }
    }

    if (error.response) {
      // The request was made and the server responded with a status code outside the 2xx range
      if (error.response.status === 401) {
        // Clear local auth data and redirect to login if unauthorized
        localStorage.removeItem('auth_token');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      
      // Show toast for errors
      const errorMessage = error.response.data?.error || 'An error occurred';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } else if (error.request) {
      // The request was made but no response was received
      toast({
        title: 'Connection Error',
        description: 'Unable to connect to the server',
        variant: 'destructive',
      });
    } else {
      // Something happened in setting up the request
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
    
    return Promise.reject(error);
  }
);
