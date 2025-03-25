
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  ClipboardCheck,
  Trophy,
  Users,
  Settings,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  exact?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  href,
  icon,
  label,
  exact = false,
}) => {
  const location = useLocation();
  const isActive = exact
    ? location.pathname === href
    : location.pathname.startsWith(href);

  return (
    <Link
      to={href}
      className={cn(
        'flex items-center space-x-3 px-3 py-2 rounded-md transition-all duration-200',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-foreground/70 hover:bg-accent hover:text-foreground'
      )}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher';

  const teacherLinks = [
    { href: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard', exact: true },
    { href: '/teacher/projects', icon: <FolderKanban size={20} />, label: 'Projects' },
    { href: '/teacher/tasks', icon: <ListTodo size={20} />, label: 'Tasks' },
    { href: '/teacher/submissions', icon: <ClipboardCheck size={20} />, label: 'Submissions' },
    { href: '/teacher/groups', icon: <Users size={20} />, label: 'Groups' },
  ];

  const studentLinks = [
    { href: '/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard', exact: true },
    { href: '/student/projects', icon: <FolderKanban size={20} />, label: 'Projects' },
    { href: '/student/tasks', icon: <ListTodo size={20} />, label: 'Tasks' },
    { href: '/student/leaderboard', icon: <Trophy size={20} />, label: 'Leaderboard' },
  ];

  const links = isTeacher ? teacherLinks : studentLinks;

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-20 flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out',
        isOpen ? 'w-64' : 'w-0 -translate-x-full sm:translate-x-0 sm:w-16'
      )}
    >
      <div className="flex flex-col h-full overflow-y-auto py-4">
        <div className="px-3 py-2">
          {isOpen ? (
            <div className="flex items-center h-12">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold">TM</span>
              </div>
              <span className="ml-2 font-semibold text-sidebar-foreground">TaskMaster</span>
            </div>
          ) : (
            <div className="flex justify-center h-12">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold">TM</span>
              </div>
            </div>
          )}
        </div>

        <div className="px-3 pt-4">
          {isOpen && (
            <p className="text-xs font-medium text-sidebar-foreground/60 uppercase mb-2 px-3">
              Main Menu
            </p>
          )}
          <nav className="space-y-1">
            {links.map((link) => (
              <SidebarLink
                key={link.href}
                href={link.href}
                icon={link.icon}
                label={link.label}
                exact={link.exact}
              />
            ))}
          </nav>
        </div>

        <div className="mt-auto px-3 pt-4">
          {isOpen && (
            <p className="text-xs font-medium text-sidebar-foreground/60 uppercase mb-2 px-3">
              Settings
            </p>
          )}
          <nav className="space-y-1">
            <SidebarLink
              href="/settings"
              icon={<Settings size={20} />}
              label="Settings"
            />
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
