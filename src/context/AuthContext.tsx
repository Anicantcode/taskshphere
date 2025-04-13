
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

// Hardcoded user credentials
const HARDCODED_USERS = [
  {
    email: 'teacher@gmail.com',
    password: 'admin123',
    name: 'Teacher Admin',
    role: 'teacher' as UserRole,
    id: 'teacher-1'
  },
  {
    email: 'group1@gmail.com',
    password: 'group1123',
    name: 'Group 1',
    role: 'student' as UserRole,
    id: 'student-1'
  },
  {
    email: 'group2@gmail.com',
    password: 'group2123',
    name: 'Group 2',
    role: 'student' as UserRole,
    id: 'student-2'
  },
  {
    email: 'group3@gmail.com',
    password: 'group3123',
    name: 'Group 3',
    role: 'student' as UserRole,
    id: 'student-3'
  },
  {
    email: 'group4@gmail.com',
    password: 'group4123',
    name: 'Group 4',
    role: 'student' as UserRole,
    id: 'student-4'
  },
  {
    email: 'group5@gmail.com',
    password: 'group5123',
    name: 'Group 5',
    role: 'student' as UserRole,
    id: 'student-5'
  }
];

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const defaultContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored user on initialization
  useEffect(() => {
    // Check if user is stored in localStorage (simulating persistence)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Find the hardcoded user with matching credentials
      const foundUser = HARDCODED_USERS.find(
        user => user.email.toLowerCase() === email.toLowerCase() && user.password === password
      );

      if (!foundUser) {
        throw new Error('Invalid credentials');
      }

      // Create a user object without the password
      const authenticatedUser: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
      };
      
      setUser(authenticatedUser);
      localStorage.setItem('user', JSON.stringify(authenticatedUser));
      
      // Show success toast
      toast({
        title: "Login successful",
        description: `Welcome back, ${foundUser.name}!`,
      });
    } catch (error) {
      console.error('Login failed', error);
      
      // Show error toast
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // Check if email already exists in hardcoded users
      const existingUser = HARDCODED_USERS.find(
        user => user.email.toLowerCase() === email.toLowerCase()
      );

      if (existingUser) {
        throw new Error('Email already in use');
      }

      // In a real implementation, we would add the user to the database
      // For now, just use the hardcoded users list for login, but pretend registration worked
      
      // Create a mock user with a random ID
      const mockUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        role,
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Show success toast
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully.",
      });
    } catch (error) {
      console.error('Registration failed', error);
      
      // Show error toast
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    
    // Show success toast
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
