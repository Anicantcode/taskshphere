
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProjectCard from '@/components/dashboard/ProjectCard';
import { Project, Task } from '@/lib/types';
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
    tasks: [
      {
        id: '1-1',
        projectId: '1',
        title: 'Define Newton\'s Laws',
        description: 'Write a clear definition of each of Newton\'s three laws of motion',
        isCompleted: false,
        dueDate: '2023-04-15T12:00:00Z'
      },
      {
        id: '1-2',
        projectId: '1',
        title: 'Create experiment setup',
        description: 'Design and document the experimental setup to demonstrate the laws',
        isCompleted: true,
        dueDate: '2023-04-12T12:00:00Z'
      }
    ]
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
    tasks: [
      {
        id: '2-1',
        projectId: '2',
        title: 'Document reaction types',
        description: 'Classify and document different types of chemical reactions',
        isCompleted: false,
        dueDate: '2023-04-20T12:00:00Z'
      }
    ]
  }
];

const StudentProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Function to assign the current student to Group 1
  const assignStudentToGroupOne = async (studentId: string) => {
    if (!studentId) return;
    
    try {
      // Check if the student is already in Group 1
      const { data: existingMembership, error: checkError } = await supabase
        .from('group_members')
        .select('*')
        .eq('student_id', studentId)
        .eq('group_id', 'group-1');
      
      if (checkError) {
        console.error('Error checking group membership:', checkError);
        return;
      }
      
      // If student is not in Group 1, add them
      if (!existingMembership || existingMembership.length === 0) {
        const { error: insertError } = await supabase
          .from('group_members')
          .insert({
            group_id: 'group-1',
            student_id: studentId
          });
          
        if (insertError) {
          console.error('Error adding student to Group 1:', insertError);
          return;
        }
        
        console.log('Successfully added student to Group 1');
        toast({
          title: 'Group Assigned',
          description: 'You have been assigned to Group 1',
        });
      } else {
        console.log('Student is already in Group 1');
      }
    } catch (error) {
      console.error('Error in assignStudentToGroupOne:', error);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      // Assign the current student to Group 1
      if (user.role === 'student') {
        await assignStudentToGroupOne(user.id);
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
        const projectsWithoutTasks: Project[] = projectData.map(project => ({
          id: project.id,
          title: project.title,
          description: project.description || '',
          teacherId: project.teacher_id,
          groupId: project.group_id,
          createdAt: project.created_at,
          updatedAt: project.updated_at,
          groupName: project.groups?.name || 'Unknown Group',
          tasks: []
        }));
        
        // If we have projects, fetch tasks for each project
        if (projectsWithoutTasks.length > 0) {
          const projectIds = projectsWithoutTasks.map(p => p.id);
          
          // Fetch tasks for all projects in one query
          const { data: tasksData, error: tasksError } = await supabase
            .from('tasks')
            .select('*')
            .in('project_id', projectIds);
            
          if (tasksError) {
            console.error('Error fetching tasks:', tasksError);
          } else if (tasksData) {
            // Map tasks to their respective projects
            const projectsWithTasks = projectsWithoutTasks.map(project => {
              const projectTasks = tasksData
                .filter(task => task.project_id === project.id)
                .map(task => ({
                  id: task.id,
                  projectId: task.project_id,
                  title: task.title,
                  description: task.description || '',
                  isCompleted: task.is_completed,
                  dueDate: task.due_date
                }));
                
              return {
                ...project,
                tasks: projectTasks
              };
            });
            
            setProjects(projectsWithTasks.length > 0 ? projectsWithTasks : MOCK_PROJECTS);
            return;
          }
        }
        
        setProjects(projectsWithoutTasks.length > 0 ? projectsWithoutTasks : MOCK_PROJECTS);
      } catch (error) {
        console.error('Error fetching projects:', error);
        // Fallback to mock data
        setProjects(MOCK_PROJECTS);
      } finally {
        setLoading(false);
      }
    };
    
    // Set up real-time subscription for projects and tasks
    const setupRealtimeSubscriptions = () => {
      const projectsChannel = supabase
        .channel('projects-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'projects'
          },
          () => {
            console.log('Projects table changed, refreshing data...');
            fetchProjects();
          }
        )
        .subscribe();
        
      const tasksChannel = supabase
        .channel('tasks-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'tasks'
          },
          () => {
            console.log('Tasks table changed, refreshing data...');
            fetchProjects();
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(projectsChannel);
        supabase.removeChannel(tasksChannel);
      };
    };

    fetchProjects();
    const cleanup = setupRealtimeSubscriptions();
    
    return cleanup;
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
