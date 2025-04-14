
import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '@/lib/types';
import { FolderKanban, Calendar, Users, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isAfter, parseISO } from 'date-fns';

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
  
  // Get the nearest due date among incomplete tasks
  const getNextDueDate = () => {
    if (!project.tasks || project.tasks.length === 0) return null;
    
    const incompleteTasks = project.tasks.filter(task => !task.isCompleted && task.dueDate);
    if (incompleteTasks.length === 0) return null;
    
    // Sort tasks by due date (earliest first)
    const sortedByDueDate = [...incompleteTasks].sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
    
    const nextDueTask = sortedByDueDate[0];
    if (!nextDueTask.dueDate) return null;
    
    const dueDate = parseISO(nextDueTask.dueDate);
    const isOverdue = isAfter(new Date(), dueDate);
    
    return {
      date: format(dueDate, 'MMM d, yyyy'),
      isOverdue,
      taskTitle: nextDueTask.title
    };
  };
  
  const nextDue = getNextDueDate();

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
      
      {nextDue && (
        <div className="mt-3 text-sm border-t border-border pt-3">
          <div className={`flex items-start ${nextDue.isOverdue ? 'text-red-500' : 'text-amber-500'}`}>
            <Calendar size={14} className="mr-1 mt-1 flex-shrink-0" />
            <div>
              <span className="font-medium">Next due: </span>
              <span>{nextDue.date}</span>
              <p className="text-xs line-clamp-1 mt-0.5">{nextDue.taskTitle}</p>
            </div>
          </div>
        </div>
      )}
      
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
