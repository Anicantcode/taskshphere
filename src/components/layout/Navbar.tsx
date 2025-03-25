
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, LogOut, User, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavbarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="mr-4 p-2 rounded-md hover:bg-accent transition-colors"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <a href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold">TM</span>
            </div>
            <span className="font-semibold hidden sm:inline-block">TaskMaster</span>
          </a>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          <button
            className="p-2 rounded-full hover:bg-accent transition-colors relative"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full" />
          </button>
          
          <div className="relative group">
            <button
              className="flex items-center space-x-1 p-1.5 rounded-full hover:bg-accent transition-colors"
              aria-label="User menu"
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-white",
                user?.role === 'teacher' ? 'bg-purple-500' : 'bg-blue-500'
              )}>
                {user?.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
              </div>
              <span className="text-sm font-medium hidden sm:block">
                {user?.name || 'User'}
              </span>
            </button>
            
            <div className="absolute right-0 mt-2 w-48 py-2 bg-card rounded-md shadow-lg border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="px-4 py-2 border-b border-border">
                <p className="text-sm font-medium">{user?.name || 'User'}</p>
                <p className="text-xs text-muted-foreground">{user?.email || ''}</p>
              </div>
              <a
                href="/profile"
                className="flex items-center px-4 py-2 text-sm hover:bg-accent transition-colors"
              >
                <User size={16} className="mr-2" />
                Profile
              </a>
              <button
                onClick={handleLogout}
                className="flex w-full items-center px-4 py-2 text-sm hover:bg-accent transition-colors text-left"
              >
                <LogOut size={16} className="mr-2" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
