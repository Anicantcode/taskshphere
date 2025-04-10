import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import ProjectCard from '@/components/dashboard/ProjectCard';
import { Project } from '@/lib/types';
import { Search, Filter, ArrowUpDown, FolderKanban } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { allProjects } from '@/lib/mockData';
import AssignedProjectsModal from '@/components/dashboard/AssignedProjectsModal';
import { useLocation } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const StudentProjects = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Extract the group ID from the student ID (assuming format: "student-X")
  const studentId = user?.id || '';
  const groupId = studentId.split('-')[1] || '';

  // Filter projects based on the student's group ID
  useEffect(() => {
    // Filter all projects to only those assigned to this group
    const groupProjects = allProjects.filter(project => project.groupId === groupId);
    setProjects(groupProjects);
    
    // Show notification if coming from login (check URL parameters or sessionStorage)
    const showNotification = sessionStorage.getItem('showProjectNotification');
    if (showNotification === 'true' && groupProjects.length > 0) {
      setShowModal(true);
      sessionStorage.removeItem('showProjectNotification');
      
      // Also show a toast notification
      toast({
        title: "Projects Assigned",
        description: `You have ${groupProjects.length} project(s) assigned to your group.`,
      });
    }
  }, [groupId]);

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
