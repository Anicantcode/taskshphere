
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Task } from '@/lib/types';
import { Search, Filter, ArrowUpDown, ClipboardList } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { allProjects } from '@/lib/mockData';
import { supabase } from '@/integrations/supabase/client';

const StudentTasks = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Extract the group ID from the student ID (assuming format: "student-X")
  const studentId = user?.id || '';
  const groupId = studentId.split('-')[1] || '';

  // Get all tasks assigned to this student's group
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        // First try to fetch from Supabase
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('id, title')
          .eq('group_id', groupId);

        if (projectsError) {
          console.error('Error fetching projects:', projectsError);
          throw projectsError;
        }

        if (projectsData && projectsData.length > 0) {
          // Get tasks for all projects
          const allTasks: Task[] = [];
          
          for (const project of projectsData) {
            const { data: tasksData, error: tasksError } = await supabase
              .from('tasks')
              .select('*')
              .eq('project_id', project.id);
              
            if (tasksError) {
              console.error(`Error fetching tasks for project ${project.id}:`, tasksError);
              continue;
            }
            
            if (tasksData && tasksData.length > 0) {
              allTasks.push(...tasksData.map(task => ({
                id: task.id,
                projectId: project.id,
                title: task.title,
                description: task.description || '',
                isCompleted: task.is_completed,
                dueDate: task.due_date,
                projectTitle: project.title
              })));
            }
          }
          
          setTasks(allTasks);
          console.log('Fetched tasks:', allTasks);
        } else {
          // Fallback to mock data
          const groupProjects = allProjects.filter(project => project.groupId === groupId);
          const groupTasks: Task[] = [];
          groupProjects.forEach(project => {
            if (project.tasks) {
              project.tasks.forEach(task => {
                groupTasks.push({
                  ...task,
                  projectTitle: project.title
                });
              });
            }
          });
          setTasks(groupTasks);
        }
      } catch (error) {
        console.error('Failed to fetch tasks, using mock data:', error);
        // Use mock data as fallback
        const groupProjects = allProjects.filter(project => project.groupId === groupId);
        const groupTasks: Task[] = [];
        groupProjects.forEach(project => {
          if (project.tasks) {
            project.tasks.forEach(task => {
              groupTasks.push({
                ...task,
                projectTitle: project.title
              });
            });
          }
        });
        setTasks(groupTasks);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTasks();
    
    // Set up real-time subscription for new tasks
    const channel = supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks'
        },
        () => {
          // Refresh tasks when changes occur
          fetchTasks();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupId]);

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(
    task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col ml-0 sm:ml-16 transition-all duration-300 ease-in-out">
        <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 py-8 px-6 animate-fadeIn">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight mb-2">Your Tasks</h1>
              <p className="text-muted-foreground">
                View and manage all your assigned tasks
              </p>
            </div>
            
            {/* Search and Filter */}
            <div className="mb-8 glass-card rounded-lg p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
                
                <div className="flex gap-2">
                  <button className="btn-secondary inline-flex items-center gap-2">
                    <Filter size={16} />
                    Filter
                  </button>
                  <button className="btn-secondary inline-flex items-center gap-2">
                    <ArrowUpDown size={16} />
                    Sort
                  </button>
                </div>
              </div>
            </div>
            
            {/* Tasks List */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="glass-card rounded-xl p-8 text-center">
                <ClipboardList className="mx-auto h-12 w-12 text-muted-foreground/60" />
                <h3 className="mt-4 text-xl font-semibold">No tasks found</h3>
                <p className="mt-2 text-muted-foreground">
                  {searchQuery
                    ? "We couldn't find any tasks matching your search."
                    : "You don't have any assigned tasks yet."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTasks.map(task => (
                  <div 
                    key={task.id} 
                    className="glass-card rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/projects/${task.projectId}`)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{task.title}</h3>
                        {task.projectTitle && (
                          <p className="text-sm text-primary mb-2">
                            {task.projectTitle}
                          </p>
                        )}
                        <p className="text-muted-foreground">{task.description}</p>
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
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentTasks;
