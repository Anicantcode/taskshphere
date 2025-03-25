
import React from 'react';
import { Task, SubmissionStatus } from '@/lib/types';
import { CheckCircle, Circle, Clock, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskListProps {
  tasks: Task[];
  onTaskClick?: (taskId: string) => void;
  className?: string;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskClick, className }) => {
  // Determine status icon
  const getStatusIcon = (task: Task) => {
    if (task.isCompleted) {
      return <CheckCircle size={18} className="text-green-500" />;
    }
    
    // If there are submissions, show the status of the most recent one
    const latestSubmission = task.submissions?.sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    )[0];
    
    if (latestSubmission) {
      switch (latestSubmission.status) {
        case 'approved':
          return <CheckCircle size={18} className="text-green-500" />;
        case 'rejected':
          return <XCircle size={18} className="text-red-500" />;
        case 'pending':
          return <Clock size={18} className="text-yellow-500" />;
        default:
          return <Circle size={18} className="text-gray-300" />;
      }
    }
    
    return <Circle size={18} className="text-gray-300" />;
  };

  return (
    <div className={cn('space-y-2', className)}>
      {tasks.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No tasks yet</p>
        </div>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => onTaskClick?.(task.id)}
            className={cn(
              'glass-card rounded-lg p-4 transition-all duration-200',
              onTaskClick && 'cursor-pointer hover:shadow-md'
            )}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0">
                {getStatusIcon(task)}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-base">{task.title}</h4>
                {task.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {task.description}
                  </p>
                )}
                
                {task.dueDate && (
                  <div className="mt-2 flex items-center text-xs text-muted-foreground">
                    <Clock size={12} className="mr-1" />
                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TaskList;
