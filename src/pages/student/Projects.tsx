
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import ProjectCard from '@/components/dashboard/ProjectCard';
import { Project, Task } from '@/lib/types';
import { Search, Filter, ArrowUpDown, FolderKanban } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { allProjects } from '@/lib/mockData';
import AssignedProjectsModal from '@/components/dashboard/AssignedProjectsModal';
import { useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const StudentProjects = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);
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

  // Fetch projects from Supabase and also use mock data as fallback
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching projects for group ID:', groupId);
        
        // Simplified approach - directly fetch projects first
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .eq('group_id', groupId);

        if (projectsError) {
          console.error('Error fetching projects:', projectsError);
          throw projectsError;
        }

        if (projectsData && projectsData.length > 0) {
          console.log('Projects found:', projectsData);
          
          // Now fetch tasks for each project
          const projectsWithTasks = await Promise.all(
            projectsData.map(async (project) => {
              const { data: tasksData, error: tasksError } = await supabase
                .from('tasks')
                .select('*')
                .eq('project_id', project.id);
                
              if (tasksError) {
                console.error(`Error fetching tasks for project ${project.id}:`, tasksError);
                return {
                  id: project.id,
                  title: project.title,
                  description: project.description || '',
                  teacherId: project.teacher_id,
                  groupId: project.group_id,
                  groupName: `Group ${project.group_id}`,
                  createdAt: project.created_at,
                  updatedAt: project.updated_at,
                  tasks: [],
                } as Project;
              }
              
              return {
                id: project.id,
                title: project.title,
                description: project.description || '',
                teacherId: project.teacher_id,
                groupId: project.group_id,
                groupName: `Group ${project.group_id}`,
                createdAt: project.created_at,
                updatedAt: project.updated_at,
                tasks: tasksData?.map(task => ({
                  id: task.id,
                  projectId: project.id,
                  title: task.title,
                  description: task.description || '',
                  isCompleted: task.is_completed,
                  dueDate: task.due_date,
                })) || [],
              } as Project;
            })
          );
          
          setProjects(projectsWithTasks);
          console.log('Formatted projects with tasks:', projectsWithTasks);
        } else {
          // Fallback to mock data if no Supabase projects
          console.log('No projects found in Supabase, using mock data');
          const groupProjects = allProjects.filter(project => project.groupId === groupId);
          setProjects(groupProjects);
          console.log('Using mock data:', groupProjects);
          
          // Optionally auto-create a test project if in development
          if (import.meta.env.DEV) {
            console.log('In development mode, creating test project');
            try {
              const { data: newProject, error: createError } = await supabase
                .from('projects')
                .insert({
                  title: 'Test Project',
                  description: 'This is a test project created automatically',
                  teacher_id: 'teacher-1',
                  group_id: groupId
                })
                .select();
                
              if (createError) {
                console.error('Error creating test project:', createError);
              } else {
                console.log('Test project created successfully:', newProject);
                toast({
                  title: "Test Project Created",
                  description: "A test project was created for your group."
                });
              }
            } catch (e) {
              console.error('Failed to create test project:', e);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch projects, using mock data:', error);
        // Fallback to mock data on error
        const groupProjects = allProjects.filter(project => project.groupId === groupId);
        setProjects(groupProjects);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      fetchProjects();
      
      // Also set up real-time subscription for new projects
      const channel = supabase
        .channel('table-db-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'projects',
            filter: `group_id=eq.${groupId}`,
          },
          (payload) => {
            console.log('New project received:', payload);
            toast({
              title: "New Project Assigned",
              description: "Your group has been assigned a new project. Refreshing...",
            });
            // Refresh projects when a new one is assigned
            fetchProjects();
          }
        )
        .subscribe();
        
      // Check for notification flag
      const showNotification = sessionStorage.getItem('showProjectNotification');
      if (showNotification === 'true') {
        setShowModal(true);
        sessionStorage.removeItem('showProjectNotification');
        
        toast({
          title: "Projects Assigned",
          description: `Checking for projects assigned to your group.`,
        });
      }
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [groupId, user]);

  // Filter projects based on search query
  const filteredProjects = projects.filter(
    project =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col ml-0 sm:ml-16 transition-all duration-300 ease-in-out">
        <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 py-8 px-6 animate-fadeIn">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight mb-2">Your Projects</h1>
              <p className="text-muted-foreground">
                View and track your assigned projects
              </p>
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
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="glass-card rounded-xl p-8 text-center">
                <FolderKanban className="mx-auto h-12 w-12 text-muted-foreground/60" />
                <h3 className="mt-4 text-xl font-semibold">No projects found</h3>
                <p className="mt-2 text-muted-foreground">
                  {searchQuery
                    ? "We couldn't find any projects matching your search."
                    : "You don't have any assigned projects yet."}
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
      
      {/* Assigned Projects Modal */}
      <AssignedProjectsModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        projects={projects}
      />
    </div>
  );
};

export default StudentProjects;
