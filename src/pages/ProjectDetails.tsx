
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Project } from '@/lib/types';
import { ArrowLeft, Calendar, Users, CheckCircle, XCircle, Clock } from 'lucide-react';

// Import the mock projects data
import { allProjects } from '@/lib/mockData';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the project in our mock data
    const foundProject = allProjects.find(p => p.id === id);
    
    if (foundProject) {
      setProject(foundProject);
    }
    
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar isOpen={isSidebarOpen} />
        <div className="flex-1 flex flex-col ml-0 sm:ml-16 transition-all duration-300 ease-in-out">
          <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <main className="flex-1 py-8 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar isOpen={isSidebarOpen} />
        <div className="flex-1 flex flex-col ml-0 sm:ml-16 transition-all duration-300 ease-in-out">
          <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <main className="flex-1 py-8 px-6">
            <div className="max-w-7xl mx-auto">
              <button 
                onClick={() => navigate(-1)} 
                className="flex items-center mb-6 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back
              </button>
              <div className="glass-card rounded-xl p-8 text-center">
                <h3 className="text-xl font-semibold">Project not found</h3>
                <p className="mt-2 text-muted-foreground">
                  The project you're looking for doesn't exist or you don't have access to it.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Calculate progress
  const totalTasks = project.tasks?.length || 0;
  const completedTasks = project.tasks?.filter(task => task.isCompleted).length || 0;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Format date
  const formattedDate = new Date(project.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex-1 flex flex-col ml-0 sm:ml-16 transition-all duration-300 ease-in-out">
        <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 py-8 px-6 animate-fadeIn">
          <div className="max-w-7xl mx-auto">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center mb-6 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back
            </button>

            <div className="glass-card rounded-xl p-6 mb-8">
              <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
              <p className="text-muted-foreground mb-4">{project.description}</p>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Calendar size={16} className="mr-1" />
                  <span>Created: {formattedDate}</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Users size={16} className="mr-1" />
                  <span>Assigned to: {project.groupName || `Group ${project.groupId}`}</span>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm">{completedTasks}/{totalTasks} tasks</span>
                </div>
                <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold mb-4">Tasks</h2>
            
            {project.tasks && project.tasks.length > 0 ? (
              <div className="grid gap-4">
                {project.tasks.map((task) => (
                  <div key={task.id} className="glass-card rounded-xl p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg flex items-center">
                          {task.isCompleted ? (
                            <CheckCircle size={18} className="mr-2 text-green-500" />
                          ) : (
                            <Clock size={18} className="mr-2 text-amber-500" />
                          )}
                          {task.title}
                        </h3>
                        <p className="mt-2 text-muted-foreground">{task.description}</p>
                        
                        {task.dueDate && (
                          <div className="mt-3 flex items-center text-sm text-muted-foreground">
                            <Calendar size={14} className="mr-1" />
                            <span>Due: {new Date(task.dueDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-shrink-0 ml-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          task.isCompleted 
                            ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400' 
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-400'
                        }`}>
                          {task.isCompleted ? 'Completed' : 'In Progress'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card rounded-xl p-6 text-center">
                <p className="text-muted-foreground">No tasks have been assigned to this project yet.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProjectDetails;
