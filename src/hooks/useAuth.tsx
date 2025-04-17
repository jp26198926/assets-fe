
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from './use-toast';
import { api } from '../lib/api';

type User = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  role: 'admin' | 'user';
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      setToken(storedToken);
      
      // If it's a mock token, create a mock user
      if (storedToken === 'mock-jwt-token') {
        setUser({
          id: 'mock-user-id',
          email: 'admin@example.com',
          firstname: 'Admin',
          lastname: 'User',
          role: 'admin'
        });
        setLoading(false);
      } else {
        fetchUser(storedToken);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (authToken: string) => {
    try {
      setLoading(true);
      const response = await api.get('/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('auth_token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await api.post('/api/auth/login', { email, password });
      const { token: authToken, user: userData } = response.data;
      
      localStorage.setItem('auth_token', authToken);
      setToken(authToken);
      setUser(userData);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.firstname}!`,
      });
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error.response?.data?.error || "Invalid credentials",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    setToken(null);
    toast({
      title: "Logout successful",
      description: "You have been logged out",
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
