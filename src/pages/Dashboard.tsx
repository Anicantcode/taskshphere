
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import ProjectCard from '@/components/dashboard/ProjectCard';
import TaskList from '@/components/dashboard/TaskList';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Project, Task } from '@/lib/types';
import { BarChart3, FolderKanban, ListTodo, Users } from 'lucide-react';

// Mock data
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Web Development Basics',
    description: 'Learn the fundamentals of HTML, CSS, and JavaScript through hands-on projects.',
    teacherId: '1',
    groupId: '1',
    groupName: 'Web Wizards',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tasks: [
      {
        id: '1',
        projectId: '1',
        title: 'Create a personal portfolio',
        description: 'Design and implement a personal portfolio website using HTML and CSS.',
        isCompleted: true,
      },
      {
        id: '2',
        projectId: '1',
        title: 'JavaScript Calculator',
        description: 'Build a functional calculator with JavaScript.',
        isCompleted: false,
      },
      {
        id: '3',
        projectId: '1',
        title: 'Responsive Navigation',
        description: 'Create a responsive navigation menu that works on all devices.',
        isCompleted: false,
      },
    ],
  },
  {
    id: '2',
    title: 'Mobile App Design',
    description: 'Design and prototype a mobile application focusing on user experience and interface.',
    teacherId: '1',
    groupId: '2',
    groupName: 'UX Designers',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    tasks: [
      {
        id: '4',
        projectId: '2',
        title: 'User Research',
        description: 'Conduct user research to understand the target audience.',
        isCompleted: true,
      },
      {
        id: '5',
        projectId: '2',
        title: 'Wireframing',
        description: 'Create wireframes for the mobile application.',
        isCompleted: true,
      },
      {
        id: '6',
        projectId: '2',
        title: 'High-fidelity Prototype',
        description: 'Design a high-fidelity prototype using Figma or Adobe XD.',
        isCompleted: false,
      },
    ],
  },
];

// Mock tasks for upcoming deadlines
const upcomingTasks: Task[] = [
  {
    id: '2',
    projectId: '1',
    title: 'JavaScript Calculator',
    description: 'Build a functional calculator with JavaScript.',
    isCompleted: false,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    projectId: '2',
    title: 'High-fidelity Prototype',
    description: 'Design a high-fidelity prototype using Figma or Adobe XD.',
    isCompleted: false,
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    projectId: '1',
    title: 'Responsive Navigation',
    description: 'Create a responsive navigation menu that works on all devices.',
    isCompleted: false,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const isTeacher = user?.role === 'teacher';

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setProjects(mockProjects);
      setTasks(upcomingTasks);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleTaskClick = (taskId: string) => {
    navigate(`/tasks/${taskId}`);
  };

  // Stats summary
  const stats = [
    {
      title: 'Total Projects',
      value: projects.length,
      icon: <FolderKanban className="h-5 w-5 text-primary" />,
      change: '+2 this month',
    },
    {
      title: 'Active Tasks',
      value: tasks.length,
      icon: <ListTodo className="h-5 w-5 text-green-500" />,
      change: '3 due soon',
    },
    {
      title: isTeacher ? 'Student Groups' : 'Your Group',
      value: isTeacher ? '5' : '1',
      icon: <Users className="h-5 w-5 text-blue-500" />,
      change: isTeacher ? '15 students' : '4 members',
    },
    {
      title: 'Completion Rate',
      value: '68%',
      icon: <BarChart3 className="h-5 w-5 text-purple-500" />,
      change: '+5% from last week',
    },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={isSidebarOpen} />
      
      <div className="flex-1 flex flex-col ml-0 sm:ml-16 transition-all duration-300 ease-in-out">
        <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 py-8 px-6">
          <div className="max-w-7xl mx-auto animate-fadeIn">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Welcome, {user?.name?.split(' ')[0] || 'User'}
            </h1>
            <p className="text-muted-foreground mb-8">
              Here's what's happening with your {isTeacher ? 'classes' : 'assignments'} today.
            </p>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {stats.map((stat, index) => (
                    <div key={index} className="glass-card rounded-xl p-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                          <p className="text-3xl font-bold mt-1">{stat.value}</p>
                          <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                        </div>
                        <div className="bg-primary/10 rounded-lg p-2.5">
                          {stat.icon}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Projects Section */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="text-xl font-semibold">Recent Projects</h2>
                      <a
                        href={isTeacher ? '/teacher/projects' : '/student/projects'}
                        className="text-sm text-primary hover:underline"
                      >
                        View all
                      </a>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                      ))}
                    </div>
                  </div>
                  
                  {/* Tasks Section */}
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="text-xl font-semibold">Upcoming Deadlines</h2>
                      <a
                        href={isTeacher ? '/teacher/tasks' : '/student/tasks'}
                        className="text-sm text-primary hover:underline"
                      >
                        View all
                      </a>
                    </div>
                    
                    <TaskList tasks={tasks} onTaskClick={handleTaskClick} />
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
