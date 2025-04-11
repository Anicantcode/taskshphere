
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import ProjectCard from '@/components/dashboard/ProjectCard';
import CreateProjectModal from '@/components/projects/CreateProjectModal';
import { Project } from '@/lib/types';
import { Plus, Search, Filter, ArrowUpDown, FolderKanban } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Mock data
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
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Filter projects based on search query
  const filteredProjects = projects.filter(
    project =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.groupName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle project creation
  const handleCreateProject = (projectData: any) => {
    // Create a new project object
    const newProject: Project = {
      id: `project-${Date.now()}`,
      title: projectData.title,
      description: projectData.description,
      teacherId: '1', // Assuming the current teacher's ID is 1
      groupId: projectData.groupId,
      groupName: `Group ${projectData.groupId}`, // Use the actual group name
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tasks: projectData.tasks.map((task: any, index: number) => ({
        id: `task-${Date.now()}-${index}`,
        projectId: `project-${Date.now()}`,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate ? task.dueDate.toISOString() : undefined,
        isCompleted: false,
      })),
    };

    // Add the new project to the projects state
    setProjects([newProject, ...projects]);
    
    // Close the modal
    setIsCreateModalOpen(false);
    
    // Show success toast
    toast({
      title: 'Project Created',
      description: `"${newProject.title}" has been assigned to ${newProject.groupName}.`,
    });
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
            {filteredProjects.length === 0 ? (
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
