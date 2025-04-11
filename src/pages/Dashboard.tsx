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
import { allProjects, upcomingTasks } from '@/lib/mockData';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const isTeacher = user?.role === 'teacher';
  
  // Extract the group ID from the student ID (assuming format: "student-X")
  const studentId = user?.id || '';
  const groupId = studentId.split('-')[1] || '';

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      if (isTeacher) {
        // For teacher, show all projects
        setProjects(allProjects);
        setTasks(upcomingTasks);
      } else {
        // For students, filter projects based on their group ID
        const filteredProjects = allProjects.filter(project => project.groupId === groupId);
        
        // Get tasks from these projects
        let groupTasks: Task[] = [];
        filteredProjects.forEach(project => {
          if (project.tasks) {
            const projectTasks = project.tasks.map(task => ({
              ...task,
              projectTitle: project.title
            }));
            groupTasks = [...groupTasks, ...projectTasks];
          }
        });
        
        // Sort by completion status and due date if available
        groupTasks.sort((a, b) => {
          if (a.isCompleted !== b.isCompleted) {
            return a.isCompleted ? 1 : -1;
          }
          if (a.dueDate && b.dueDate) {
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          }
          return 0;
        });
        
        setProjects(filteredProjects);
        setTasks(groupTasks.slice(0, 3)); // Show only the first 3 tasks
      }
      
      setIsLoading(false);
    }, 1000);
  }, [isTeacher, groupId]);

  const handleTaskClick = (taskId: string) => {
    // Find the project ID for this task
    for (const project of projects) {
      const task = project.tasks?.find(t => t.id === taskId);
      if (task) {
        navigate(`/projects/${project.id}`);
        return;
      }
    }
  };

  // Stats summary
  const stats = [
    {
      title: 'Total Projects',
      value: projects.length,
      icon: <FolderKanban className="h-5 w-5 text-primary" />,
      change: `${projects.length} active projects`,
    },
    {
      title: 'Active Tasks',
      value: projects.reduce((count, project) => 
        count + (project.tasks?.filter(task => !task.isCompleted).length || 0), 0),
      icon: <ListTodo className="h-5 w-5 text-green-500" />,
      change: 'Need attention',
    },
    {
      title: isTeacher ? 'Student Groups' : 'Your Group',
      value: isTeacher ? '5' : groupId,
      icon: <Users className="h-5 w-5 text-blue-500" />,
      change: isTeacher ? '15 students' : '4 members',
    },
    {
      title: 'Completion Rate',
      value: (() => {
        const totalTasks = projects.reduce((count, project) => 
          count + (project.tasks?.length || 0), 0);
        const completedTasks = projects.reduce((count, project) => 
          count + (project.tasks?.filter(task => task.isCompleted).length || 0), 0);
        
        return totalTasks > 0 ? `${Math.round((completedTasks / totalTasks) * 100)}%` : '0%';
      })(),
      icon: <BarChart3 className="h-5 w-5 text-purple-500" />,
      change: 'Overall progress',
    },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}
      
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out w-full">
        <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        
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
                    
                    {projects.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {projects.slice(0, 4).map((project) => (
                          <ProjectCard key={project.id} project={project} />
                        ))}
                      </div>
                    ) : (
                      <div className="glass-card rounded-xl p-6 text-center">
                        <p className="text-muted-foreground">No projects assigned yet.</p>
                      </div>
                    )}
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
                    
                    {tasks.length > 0 ? (
                      <TaskList tasks={tasks} onTaskClick={handleTaskClick} />
                    ) : (
                      <div className="glass-card rounded-xl p-6 text-center">
                        <p className="text-muted-foreground">No upcoming tasks.</p>
                      </div>
                    )}
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
