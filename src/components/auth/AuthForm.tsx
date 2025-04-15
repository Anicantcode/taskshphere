
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/lib/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { toast } from '@/hooks/use-toast';
import { AlertCircle, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AuthFormProps {
  type: 'login' | 'register';
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const navigate = useNavigate();
  const { login, register: registerUser, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' as UserRole,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null); // Clear error when user changes input
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log(`Attempting ${type}...`);
      
      if (type === 'register') {
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords don't match");
          setIsLoading(false);
          return;
        }
        
        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters long");
          setIsLoading(false);
          return;
        }

        await registerUser(formData.name, formData.email, formData.password, formData.role);
        toast({
          title: "Account created",
          description: "Please check your email for verification instructions.",
        });
      } else {
        console.log('Calling login function with:', formData.email);
        await login(formData.email, formData.password);
        console.log('Login function completed');
        
        // Redirect will be handled by protected routes in App.tsx
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      setError(error.message || "Authentication failed. Please check your credentials and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card w-full max-w-md p-8 rounded-lg animate-fadeIn">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        {type === 'login' ? 'Sign In' : 'Create Account'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-destructive mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {type === 'register' && (
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Full Name
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              disabled={isLoading}
            />
          </div>
        )}
        
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            Email Address
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            disabled={isLoading || authLoading}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            disabled={isLoading || authLoading}
          />
          {type === 'register' && (
            <p className="text-xs text-muted-foreground">
              Password must be at least 6 characters long
            </p>
          )}
        </div>
        
        {type === 'register' && (
          <>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="role" className="block text-sm font-medium">
                I am a
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                required
                disabled={isLoading}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
          </>
        )}
        
        <Button
          type="submit"
          variant="default"
          size="lg"
          disabled={isLoading || authLoading}
          className="w-full flex items-center justify-center gap-2"
        >
          {(isLoading || authLoading) ? (
            <LoadingSpinner size="sm" />
          ) : type === 'login' ? (
            <>
              <LogIn size={18} />
              Sign In
            </>
          ) : (
            <>
              <UserPlus size={18} />
              Create Account
            </>
          )}
        </Button>
      </form>
      
      <div className="mt-6 text-center text-sm">
        {type === 'login' ? (
          <p>
            Don't have an account?{' '}
            <a href="/register" className="text-primary hover:underline">
              Sign up
            </a>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <a href="/login" className="text-primary hover:underline">
              Sign in
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
