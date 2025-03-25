
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import ProjectCard from '@/components/dashboard/ProjectCard';
import { Project, Task } from '@/lib/types';
import { Plus, Search, Filter, ArrowUpDown, FolderKanban } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const TeacherProjects = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      
      setLoading(true);
      
      try {
        // Get projects created by this teacher
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select(`
            id,
            title,
            description,
            teacher_id,
            group_id,
            created_at,
            updated_at,
            groups(name)
          `)
          .eq('teacher_id', user.id);
        
        if (projectsError) throw projectsError;
        
        // For each project, get its tasks
        const projectsWithTasks = await Promise.all(projectsData.map(async (project) => {
          const { data: tasksData, error: tasksError } = await supabase
            .from('tasks')
            .select('*')
            .eq('project_id', project.id);
          
          if (tasksError) throw tasksError;
          
          // Map the database tasks to our Task type
          const mappedTasks: Task[] = tasksData.map(task => ({
            id: task.id,
            projectId: task.project_id,
            title: task.title,
            description: task.description || '',
            isCompleted: task.is_completed,
            dueDate: task.due_date,
          }));
          
          return {
            id: project.id,
            title: project.title,
            description: project.description || '',
            teacherId: project.teacher_id,
            groupId: project.group_id,
            groupName: project.groups?.name,
            createdAt: project.created_at,
            updatedAt: project.updated_at,
            tasks: mappedTasks
          } as Project;
        }));
        
        setProjects(projectsWithTasks);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: 'Error',
          description: 'Failed to load projects. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, [user]);

  // Filter projects based on search query
  const filteredProjects = projects.filter(
    project =>
      project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.groupName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={isSidebarOpen} />
      
      <div className="flex-1 flex flex-col ml-0 sm:ml-16 transition-all duration-300 ease-in-out">
        <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 py-8 px-6 animate-fadeIn">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Projects</h1>
                <p className="text-muted-foreground">
                  Manage your class projects and assignments
                </p>
              </div>
              
              <button className="btn-primary inline-flex items-center gap-2 self-start sm:self-center">
                <Plus size={18} />
                Create Project
              </button>
            </div>
            
            {/* Search and Filter */}
            <div className="mb-8 glass-card rounded-lg p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search projects..."
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
            
            {/* Projects Grid */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="glass-card rounded-xl p-8 text-center">
                <FolderKanban className="mx-auto h-12 w-12 text-muted-foreground/60" />
                <h3 className="mt-4 text-xl font-semibold">No projects found</h3>
                <p className="mt-2 text-muted-foreground">
                  {searchQuery
                    ? "We couldn't find any projects matching your search."
                    : "You haven't created any projects yet. Click the 'Create Project' button to get started."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherProjects;
