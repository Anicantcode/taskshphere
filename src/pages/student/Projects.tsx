
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import ProjectCard from '@/components/dashboard/ProjectCard';
import { Project } from '@/lib/types';
import { Search, Filter, ArrowUpDown, FolderKanban } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// Mock data
const allProjects: Project[] = [
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
  {
    id: '5',
    title: 'Mobile App Development',
    description: 'Create a fully functional mobile app using React Native.',
    teacherId: '1',
    groupId: '5',
    groupName: 'Group 5',
    createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    tasks: [
      {
        id: '11',
        projectId: '5',
        title: 'App Planning and Wireframing',
        description: 'Plan the app structure and create wireframes.',
        isCompleted: true,
      },
      {
        id: '12',
        projectId: '5',
        title: 'App Implementation',
        description: 'Build the React Native application.',
        isCompleted: false,
      },
    ],
  },
];

const StudentProjects = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);

  // Extract the group ID from the student ID (assuming format: "student-X")
  const studentId = user?.id || '';
  const groupId = studentId.split('-')[1] || '';

  // Filter projects based on the student's group ID
  useEffect(() => {
    // Filter all projects to only those assigned to this group
    const groupProjects = allProjects.filter(project => project.groupId === groupId);
    setProjects(groupProjects);
  }, [groupId]);

  // Filter projects based on search query
  const filteredProjects = projects.filter(
    project =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={isSidebarOpen} />
      
      <div className="flex-1 flex flex-col ml-0 sm:ml-16 transition-all duration-300 ease-in-out">
        <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
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
            {filteredProjects.length === 0 ? (
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
    </div>
  );
};

export default StudentProjects;
