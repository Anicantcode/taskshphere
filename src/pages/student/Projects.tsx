
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProjectCard from '@/components/dashboard/ProjectCard';
import { Project } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Mock data for fallback
const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Physics Lab Report',
    description: 'Complete a lab report on Newton\'s Laws of Motion',
    teacherId: 'teacher-1',
    groupId: 'group-1',
    createdAt: '2023-04-10T12:00:00Z',
    updatedAt: '2023-04-10T12:00:00Z',
    groupName: 'Physics Group',
  },
  {
    id: '2',
    title: 'Chemistry Research',
    description: 'Research on chemical reactions and their effects',
    teacherId: 'teacher-2',
    groupId: 'group-2',
    createdAt: '2023-04-15T10:00:00Z',
    updatedAt: '2023-04-15T10:00:00Z',
    groupName: 'Chemistry Group',
  }
];

const StudentProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Fetch the groups that the student belongs to
        const { data: groupMemberships, error: groupError } = await supabase
          .from('group_members')
          .select('group_id')
          .eq('student_id', user.id);

        if (groupError) {
          console.error('Error fetching group memberships:', groupError);
          // Fallback to mock data
          setProjects(MOCK_PROJECTS);
          return;
        }

        if (!groupMemberships || groupMemberships.length === 0) {
          // No groups found, use mock data
          setProjects(MOCK_PROJECTS);
          return;
        }

        // Extract group IDs
        const groupIds = groupMemberships.map(membership => membership.group_id);

        // Fetch projects for these groups
        const { data: projectData, error: projectError } = await supabase
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
          .in('group_id', groupIds);

        if (projectError) {
          console.error('Error fetching projects:', projectError);
          // Fallback to mock data
          setProjects(MOCK_PROJECTS);
          return;
        }

        // Map the Supabase data to our Project type
        const formattedProjects: Project[] = projectData.map(project => ({
          id: project.id,
          title: project.title,
          description: project.description || '',
          teacherId: project.teacher_id,
          groupId: project.group_id,
          createdAt: project.created_at,
          updatedAt: project.updated_at,
          groupName: project.groups?.name || 'Unknown Group',
        }));

        setProjects(formattedProjects.length > 0 ? formattedProjects : MOCK_PROJECTS);
      } catch (error) {
        console.error('Error fetching projects:', error);
        // Fallback to mock data
        setProjects(MOCK_PROJECTS);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Projects</h1>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton h-64 rounded-lg"></div>
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                className=""
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl mb-2">No projects found</h3>
            <p className="text-gray-500">
              You don't have any projects assigned to you yet.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentProjects;
