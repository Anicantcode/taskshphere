
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Project, Task } from '@/lib/types';
import { ArrowLeft, Calendar, Users, CheckCircle, Clock, AlertTriangle, PlusCircle, X } from 'lucide-react';
import { format, isAfter, parseISO, formatDistance } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import AddTaskForm from '@/components/projects/AddTaskForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Import the mock projects data as fallback
import { allProjects } from '@/lib/mockData';

const TaskItem = ({ task, onToggleComplete }: { task: Task, onToggleComplete?: (taskId: string, isCompleted: boolean) => Promise<void> }) => {
  const isDueDate = task.dueDate ? parseISO(task.dueDate) : null;
  const isPastDue = isDueDate ? isAfter(new Date(), isDueDate) : false;
  const [updating, setUpdating] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking on the task status
    if (!onToggleComplete || updating) return;
    
    setUpdating(true);
    try {
      await onToggleComplete(task.id, !task.isCompleted);
    } finally {
      setUpdating(false);
    }
  };
  
  return (
    <div className="glass-card rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-lg flex items-center">
            <div 
              className={`mr-2 cursor-pointer ${updating ? 'opacity-50' : ''}`}
              onClick={handleToggle}
            >
              {task.isCompleted ? (
                <CheckCircle size={18} className="text-green-500" />
              ) : (
                <Clock size={18} className="text-amber-500" />
              )}
            </div>
            {task.title}
          </h3>
          <p className="mt-2 text-muted-foreground">{task.description}</p>
          
          {task.dueDate && (
            <div className={`mt-3 flex items-center text-sm ${
              isPastDue && !task.isCompleted ? 'text-red-500' : 'text-muted-foreground'
            }`}>
              {isPastDue && !task.isCompleted ? (
                <AlertTriangle size={14} className="mr-1" />
              ) : (
                <Calendar size={14} className="mr-1" />
              )}
              <span>
                Due: {format(parseISO(task.dueDate), 'MMM d, yyyy')}
                {isPastDue && !task.isCompleted && ' (Overdue)'}
                {!isPastDue && !task.isCompleted && (
                  <span className="ml-1">
                    ({formatDistance(parseISO(task.dueDate), new Date(), { addSuffix: true })})
                  </span>
                )}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex-shrink-0 ml-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            task.isCompleted 
              ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400' 
              : isPastDue
                ? 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-400'
          }`}>
            {task.isCompleted ? 'Completed' : isPastDue ? 'Overdue' : 'In Progress'}
          </span>
        </div>
      </div>
    </div>
  );
};

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Check if the current user is a teacher
  const isTeacher = user?.role === 'teacher';

  const fetchProjectDetails = async () => {
    setLoading(true);
    
    try {
      if (!id) return;
      
      // Try to fetch the project from Supabase
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select(`
          id, 
          title, 
          description, 
          teacher_id,
          group_id, 
          created_at,
          updated_at
        `)
        .eq('id', id)
        .single();
      
      if (projectError) {
        console.error('Error fetching project:', projectError);
        // Try to find the project in mock data as fallback
        const mockProject = allProjects.find(p => p.id === id);
        if (mockProject) {
          setProject(mockProject);
        }
        setLoading(false);
        return;
      }
      
      if (!projectData) {
        setLoading(false);
        return;
      }
      
      // Fetch tasks for this project
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', id);
        
      if (tasksError) {
        console.error('Error fetching tasks:', tasksError);
        toast({
          title: 'Error',
          description: 'Could not load tasks for this project.',
          variant: 'destructive',
        });
      }
      
      // Get group name
      let groupName = `Group ${projectData.group_id}`;
      try {
        const { data: groupData } = await supabase
          .from('groups')
          .select('name')
          .eq('id', projectData.group_id)
          .single();
          
        if (groupData) {
          groupName = groupData.name;
        }
      } catch (error) {
        console.error('Error fetching group name:', error);
      }
      
      // Create the full project object
      const fullProject: Project = {
        id: projectData.id,
        title: projectData.title,
        description: projectData.description || '',
        teacherId: projectData.teacher_id,
        groupId: projectData.group_id,
        groupName: groupName,
        createdAt: projectData.created_at,
        updatedAt: projectData.updated_at,
        tasks: tasksData?.map(task => ({
          id: task.id,
          projectId: task.project_id,
          title: task.title,
          description: task.description || '',
          isCompleted: task.is_completed,
          dueDate: task.due_date,
        })) || [],
      };
      
      setProject(fullProject);
    } catch (error) {
      console.error('Error in fetchProjectDetails:', error);
      // Try to find the project in mock data as fallback
      if (id) {
        const mockProject = allProjects.find(p => p.id === id);
        if (mockProject) {
          setProject(mockProject);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
    
    // Setup real-time task updates
    const channel = supabase
      .channel('project-tasks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: id ? `project_id=eq.${id}` : undefined,
        },
        () => {
          fetchProjectDetails();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  // Handle task completion toggle
  const handleToggleTaskComplete = async (taskId: string, isCompleted: boolean) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ is_completed: isCompleted })
        .eq('id', taskId);
        
      if (error) throw error;
      
      toast({
        title: isCompleted ? 'Task Completed' : 'Task Reopened',
        description: isCompleted 
          ? 'Task has been marked as completed.' 
          : 'Task has been reopened.'
      });
      
      // Update the local state
      if (project) {
        setProject({
          ...project,
          tasks: project.tasks?.map(task => 
            task.id === taskId ? { ...task, isCompleted } : task
          ) || []
        });
      }
      
    } catch (error: any) {
      console.error('Error updating task status:', error);
      toast({
        title: 'Failed to update task',
        description: error.message || 'There was an error updating the task status.',
        variant: 'destructive',
      });
    }
  };

  // Handle task addition
  const handleTaskAdded = () => {
    setIsAddTaskDialogOpen(false);
    fetchProjectDetails();
    toast({
      title: 'Task Added',
      description: 'The new task has been added to the project.'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
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
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
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
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
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
            
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Tasks</h2>
              
              {isTeacher && (
                <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-1">
                      <PlusCircle size={16} />
                      <span>Add Task</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Add New Task</DialogTitle>
                      <DialogDescription>
                        Create a new task for this project.
                      </DialogDescription>
                    </DialogHeader>
                    <AddTaskForm 
                      projectId={project.id}
                      onSuccess={handleTaskAdded}
                      onCancel={() => setIsAddTaskDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              )}
            </div>
            
            {project?.tasks && project.tasks.length > 0 ? (
              <div className="grid gap-4">
                {project.tasks.map((task) => (
                  <TaskItem 
                    key={task.id} 
                    task={task} 
                    onToggleComplete={handleToggleTaskComplete}
                  />
                ))}
              </div>
            ) : (
              <div className="glass-card rounded-xl p-6 text-center">
                <p className="text-muted-foreground">
                  {isTeacher 
                    ? "No tasks yet. Add tasks to help students track their progress."
                    : "No tasks have been assigned to this project yet."
                  }
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProjectDetails;
