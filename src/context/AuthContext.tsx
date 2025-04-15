
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

  // Check for authenticated user on initialization
  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      try {
        // Check current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Get user profile from profiles table
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Error fetching user profile:', profileError);
            throw profileError;
          }

          // Create user object
          const authenticatedUser: User = {
            id: session.user.id,
            name: profile.name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            role: profile.role as UserRole,
            avatar: profile.avatar_url,
          };

          setUser(authenticatedUser);
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Call the function
    checkSession();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Get user profile after sign-in
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            console.error('Error fetching profile:', profileError);
            return;
          }

          // If profile doesn't exist, it might be a new registration
          const authenticatedUser: User = {
            id: session.user.id,
            name: profile?.name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            role: profile?.role as UserRole || 'student',
            avatar: profile?.avatar_url,
          };

          setUser(authenticatedUser);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    // Cleanup subscription
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('Attempting login for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      if (!data.user) {
        console.error('No user returned after login');
        throw new Error('Login failed - no user data returned');
      }

      console.log('Login successful, session:', data.session);
      
      // Get user profile after successful authentication
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile after login:', profileError);
        // We'll continue despite profile error - the auth listener should handle this
      }

      // If we got the profile, update the user state immediately
      // instead of waiting for the auth listener
      if (profile) {
        const authenticatedUser: User = {
          id: data.user.id,
          name: profile?.name || data.user.email?.split('@')[0] || 'User',
          email: data.user.email || '',
          role: profile?.role as UserRole || 'student',
          avatar: profile?.avatar_url,
        };
        setUser(authenticatedUser);
      }

      // Success toast
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
    } catch (error: any) {
      console.error('Login failed', error);
      
      // Show error toast with more descriptive message
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password. Please try again.",
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
      // 1. First, verify the email isn't already registered
      const { data: existingUsers, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email);

      if (checkError) {
        console.error('Error checking existing user:', checkError);
        throw new Error('Error checking if user already exists');
      }

      if (existingUsers && existingUsers.length > 0) {
        throw new Error('Email address is already registered');
      }

      // 2. Create the auth user with signUp
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            role: role,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error("User creation failed");
      }

      // 3. Create the profile entry in a separate transaction to avoid DB errors
      // The RLS policy might not allow the user to create their profile immediately,
      // so it's better to show a success message without waiting for profile creation
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully. Check your email for verification.",
      });
      
      try {
        // Wait a moment for the auth user to be fully created
        setTimeout(async () => {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user!.id,
              email: email,
              name: name,
              role: role,
            });
  
          if (profileError) {
            console.error('Profile creation failed:', profileError);
            // Don't throw here - we already showed success to the user
          }
        }, 1000);
      } catch (profileError) {
        console.error('Profile creation error:', profileError);
        // Don't throw here - we already showed success to the user
      }
      
    } catch (error: any) {
      console.error('Registration failed', error);
      
      // Show error toast
      toast({
        title: "Registration failed",
        description: error.message || "An unknown error occurred.",
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      setUser(null);
      
      // Show success toast
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      console.error('Logout failed', error);
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred during logout.",
        variant: "destructive",
      });
    }
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
