
import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '@/lib/types';
import { FolderKanban, Calendar, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, className }) => {
  // Calculate progress based on completed tasks
  const totalTasks = project.tasks?.length || 0;
  const completedTasks = project.tasks?.filter(task => task.isCompleted).length || 0;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  // Format date
  const formattedDate = new Date(project.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Link
      to={`/projects/${project.id}`}
      className={cn(
        'glass-card rounded-xl p-5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 block',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-primary">
            <FolderKanban size={20} />
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-lg line-clamp-1">{project.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {project.groupName || `Group: ${project.groupId}`}
            </p>
          </div>
        </div>
      </div>
      
      <p className="mt-4 text-sm text-foreground/80 line-clamp-2">
        {project.description}
      </p>
      
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium">Progress</span>
          <span className="text-xs">{completedTasks}/{totalTasks} tasks</span>
        </div>
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center">
          <Calendar size={14} className="mr-1" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center">
          <Users size={14} className="mr-1" />
          <span>Group Project</span>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
