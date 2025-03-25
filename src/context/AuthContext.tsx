
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

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
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsLoading(true);
        
        if (session && session.user) {
          try {
            // Get the user profile from our profiles table
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (error) throw error;

            if (profile) {
              setUser({
                id: profile.id,
                name: profile.name,
                email: profile.email,
                role: profile.role as UserRole,
                avatar: profile.avatar_url,
              });
              setSession(session);
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        } else {
          setUser(null);
          setSession(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // The onAuthStateChange handler will populate the user
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Login failed', error);
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: error.error_description || error.message || 'Please check your credentials and try again.',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      // Create the auth user without metadata first to avoid trigger issues
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        console.error('Auth registration error:', authError);
        throw authError;
      }
      
      if (!authData?.user) {
        throw new Error('User creation failed - no user returned');
      }
      
      // Now manually create/update the profile with the role
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          name,
          email,
          role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
      if (profileError) {
        console.error('Profile creation error:', profileError);
        
        // Only attempt cleanup if we have access to admin functions (unlikely in client)
        try {
          await supabase.auth.admin?.deleteUser(authData.user.id);
        } catch (cleanupError) {
          console.error('Failed to clean up auth user after profile creation error:', cleanupError);
        }
        
        toast({
          variant: 'destructive',
          title: 'Profile creation failed',
          description: profileError.message || 'Unable to complete registration.',
        });
        throw profileError;
      }
      
      toast({
        title: 'Registration successful',
        description: 'Your account has been created successfully.',
      });
    } catch (error: any) {
      console.error('Registration failed', error);
      toast({
        variant: 'destructive',
        title: 'Registration failed',
        description: error.error_description || error.message || 'Please try again later.',
      });
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Logout failed', error);
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
