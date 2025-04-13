
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Task } from '@/lib/types';
import { Search, Filter, ArrowUpDown, ClipboardList, Calendar, CheckCircle, Circle, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { allProjects } from '@/lib/mockData';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { format, isAfter, parseISO, formatDistance } from 'date-fns';

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
  let groupId = studentId.split('-')[1] || '';
  
  // If groupId is not numeric, set a default for testing
  if (!groupId || !/^\d+$/.test(groupId)) {
    console.warn('Could not extract valid group ID from student ID, using default "1"');
    groupId = '1';
  }
  
  console.log('Student ID:', studentId, 'Group ID:', groupId);

  // Get all tasks assigned to this student's group
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching tasks for group ID:', groupId);
        
        // Check if the group exists, if not create it
        const { data: groupExists, error: groupCheckError } = await supabase
          .from('groups')
          .select('id')
          .eq('id', groupId)
          .single();
          
        if (groupCheckError && groupCheckError.code === 'PGRST116') {
          console.log('Group does not exist, creating it...');
          
          // Create the group
          const { data: newGroup, error: createGroupError } = await supabase
            .from('groups')
            .insert({
              id: groupId,
              name: `Group ${groupId}`,
              created_by: 'teacher-1' // Default teacher ID
            })
            .select()
            .single();
            
          if (createGroupError) {
            console.error('Failed to create group:', createGroupError);
            // Continue anyway, group might exist but not visible due to RLS
          } else {
            console.log('Group created successfully:', newGroup);
          }
        }
        
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
          console.log('Projects found:', projectsData);
          
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
              console.log(`Found ${tasksData.length} tasks for project ${project.id}`);
              
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
          console.log('All fetched tasks:', allTasks);
        } else {
          console.log('No projects found in Supabase, using mock data');
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
    
    if (user) {
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
          (payload) => {
            console.log('Task change detected:', payload);
            toast({
              title: "Task Updated",
              description: "A task has been updated. Refreshing your task list.",
            });
            // Refresh tasks when changes occur
            fetchTasks();
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [groupId, user]);

  // Filter tasks based on search query
  const filteredTasks = tasks.filter(
    task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Function to render task status icon
  const getStatusIcon = (task: Task) => {
    if (task.isCompleted) {
      return <CheckCircle size={18} className="text-green-500" />;
    }
    
    if (task.dueDate) {
      const dueDate = new Date(task.dueDate);
      const isPastDue = isAfter(new Date(), dueDate);
      
      if (isPastDue) {
        return <Clock size={18} className="text-red-500" />;
      }
    }
    
    return <Circle size={18} className="text-gray-300" />;
  };

  // Format due date if exists
  const formatDueDate = (dueDate?: string) => {
    if (!dueDate) return null;
    
    const date = parseISO(dueDate);
    const isPastDue = isAfter(new Date(), date);
    const formattedDate = format(date, 'MMM d, yyyy');
    
    return {
      formattedDate,
      isPastDue,
      timeUntil: !isPastDue ? formatDistance(date, new Date(), { addSuffix: true }) : 'Overdue'
    };
  };

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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTasks.map(task => {
                  const dueInfo = task.dueDate ? formatDueDate(task.dueDate) : null;
                  
                  return (
                    <Card 
                      key={task.id} 
                      className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigate(`/projects/${task.projectId}`)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2 text-lg">
                              {getStatusIcon(task)}
                              {task.title}
                            </CardTitle>
                            {task.projectTitle && (
                              <CardDescription className="text-primary mt-1">
                                {task.projectTitle}
                              </CardDescription>
                            )}
                          </div>
                          
                          <div className="flex-shrink-0">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              task.isCompleted 
                                ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400' 
                                : dueInfo?.isPastDue
                                  ? 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-400'
                            }`}>
                              {task.isCompleted ? 'Completed' : dueInfo?.isPastDue ? 'Overdue' : 'In Progress'}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        {task.description && (
                          <p className="text-muted-foreground text-sm line-clamp-2">
                            {task.description}
                          </p>
                        )}
                      </CardContent>
                      
                      {dueInfo && (
                        <CardFooter className="pt-0 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar size={12} className="mr-1" />
                            <span>
                              Due: {dueInfo.formattedDate}
                              <span className={`ml-1 ${dueInfo.isPastDue ? 'text-red-500' : ''}`}>
                                ({dueInfo.timeUntil})
                              </span>
                            </span>
                          </div>
                        </CardFooter>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentTasks;
