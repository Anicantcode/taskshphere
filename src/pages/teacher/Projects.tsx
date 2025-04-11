
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import ProjectCard from '@/components/dashboard/ProjectCard';
import CreateProjectModal from '@/components/projects/CreateProjectModal';
import { Project } from '@/lib/types';
import { Plus, Search, Filter, ArrowUpDown, FolderKanban } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Mock data as fallback
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Web Development Basics',
    description: 'Learn the fundamentals of HTML, CSS, and JavaScript through hands-on projects.',
    teacherId: '1',
    groupId: '1',
    groupName: 'Group 1',
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
    ],
  },
  {
    id: '2',
    title: 'Mobile App Design',
    description: 'Design and prototype a mobile application focusing on user experience and interface.',
    teacherId: '1',
    groupId: '2',
    groupName: 'Group 2',
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
    ],
  },
  {
    id: '3',
    title: 'Data Science Fundamentals',
    description: 'Introduction to data analysis, visualization, and basic machine learning concepts.',
    teacherId: '1',
    groupId: '3',
    groupName: 'Group 3',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    tasks: [
      {
        id: '7',
        projectId: '3',
        title: 'Data Cleaning',
        description: 'Clean and prepare a dataset for analysis.',
        isCompleted: true,
      },
      {
        id: '8',
        projectId: '3',
        title: 'Exploratory Data Analysis',
        description: 'Perform exploratory data analysis and create visualizations.',
        isCompleted: false,
      },
    ],
  },
  {
    id: '4',
    title: 'Cybersecurity Workshop',
    description: 'Explore common security vulnerabilities and implement protection strategies.',
    teacherId: '1',
    groupId: '4',
    groupName: 'Group 4',
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    tasks: [
      {
        id: '9',
        projectId: '4',
        title: 'Network Security Audit',
        description: 'Perform a basic security audit on a sample network.',
        isCompleted: true,
      },
      {
        id: '10',
        projectId: '4',
        title: 'Password Policy Implementation',
        description: 'Design and document a secure password policy.',
        isCompleted: true,
      },
    ],
  },
];

const TeacherProjects = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fetch projects from Supabase
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const { data: supabaseProjects, error } = await supabase
          .from('projects')
          .select(`
            id,
            title, 
            description,
            teacher_id,
            group_id,
            created_at,
            updated_at,
            tasks(
              id,
              title,
              description,
              is_completed,
              due_date
            )
          `);

        if (error) {
          console.error('Error fetching projects:', error);
          throw error;
        }

        if (supabaseProjects && supabaseProjects.length > 0) {
          // Transform Supabase data to match our Project type
          const formattedProjects: Project[] = await Promise.all(
            supabaseProjects.map(async (proj) => {
              // Get group name for display
              let groupName = `Group ${proj.group_id}`;
              try {
                const { data: groupData } = await supabase
                  .from('groups')
                  .select('name')
                  .eq('id', proj.group_id)
                  .single();
                
                if (groupData) {
                  groupName = groupData.name;
                }
              } catch (err) {
                console.error('Error fetching group name:', err);
              }

              return {
                id: proj.id,
                title: proj.title,
                description: proj.description || '',
                teacherId: proj.teacher_id,
                groupId: proj.group_id,
                groupName: groupName,
                createdAt: proj.created_at,
                updatedAt: proj.updated_at,
                tasks: proj.tasks?.map(task => ({
                  id: task.id,
                  projectId: proj.id,
                  title: task.title,
                  description: task.description || '',
                  isCompleted: task.is_completed,
                  dueDate: task.due_date,
                })) || [],
              };
            })
          );
          
          setProjects(formattedProjects);
        } else {
          // Fallback to mock data if no Supabase projects
          console.log('No projects found in Supabase, using mock data');
          setProjects(mockProjects);
        }
      } catch (error) {
        console.error('Failed to fetch projects, using mock data:', error);
        setProjects(mockProjects);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProjects();
    
    // Set up real-time subscription for changes
    const channel = supabase
      .channel('table-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
        },
        () => {
          fetchProjects();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filter projects based on search query
  const filteredProjects = projects.filter(
    project =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.groupName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle project creation with Supabase integration
  const handleCreateProject = async (projectData: any) => {
    try {
      // Insert project into Supabase
      const { data: projectInsert, error: projectError } = await supabase
        .from('projects')
        .insert({
          title: projectData.title,
          description: projectData.description,
          teacher_id: '1', // Assuming the current teacher's ID
          group_id: projectData.groupId
        })
        .select()
        .single();
      
      if (projectError) {
        throw projectError;
      }
      
      // Insert tasks for the project
      if (projectInsert && projectData.tasks && projectData.tasks.length > 0) {
        const tasksToInsert = projectData.tasks.map((task: any) => ({
          project_id: projectInsert.id,
          title: task.title,
          description: task.description,
          due_date: task.dueDate ? task.dueDate.toISOString() : null,
          is_completed: false
        }));
        
        const { error: tasksError } = await supabase
          .from('tasks')
          .insert(tasksToInsert);
          
        if (tasksError) {
          console.error('Error inserting tasks:', tasksError);
        }
      }
      
      // Get group name for display
      let groupName = `Group ${projectData.groupId}`;
      try {
        const { data: groupData } = await supabase
          .from('groups')
          .select('name')
          .eq('id', projectData.groupId)
          .single();
        
        if (groupData) {
          groupName = groupData.name;
        }
      } catch (err) {
        console.error('Error fetching group name:', err);
      }
      
      // Add the new project to the local state
      const newProject: Project = {
        id: projectInsert.id,
        title: projectData.title,
        description: projectData.description,
        teacherId: '1',
        groupId: projectData.groupId,
        groupName: groupName,
        createdAt: projectInsert.created_at,
        updatedAt: projectInsert.updated_at,
        tasks: projectData.tasks.map((task: any, index: number) => ({
          id: `temp-id-${index}`, // Temporary ID until we fetch from DB
          projectId: projectInsert.id,
          title: task.title,
          description: task.description,
          dueDate: task.dueDate ? task.dueDate.toISOString() : undefined,
          isCompleted: false,
        })),
      };
      
      // Trigger notification for students
      localStorage.setItem('newProjectAssigned', 'true');
      
      // Update the UI
      setProjects([newProject, ...projects]);
      
      // Close the modal
      setIsCreateModalOpen(false);
      
      // Show success toast
      toast({
        title: 'Project Created',
        description: `"${newProject.title}" has been assigned to ${newProject.groupName}.`,
      });
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: 'Error Creating Project',
        description: 'There was an error creating your project. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col ml-0 sm:ml-16 transition-all duration-300 ease-in-out">
        <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 py-8 px-6 animate-fadeIn">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Projects</h1>
                <p className="text-muted-foreground">
                  Manage your class projects and assignments
                </p>
              </div>
              
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="btn-primary inline-flex items-center gap-2 self-start sm:self-center"
              >
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
      
      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProject}
      />
    </div>
  );
};

export default TeacherProjects;
