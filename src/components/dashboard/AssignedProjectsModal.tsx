
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Project } from '@/lib/types';
import { FolderKanban } from 'lucide-react';

interface AssignedProjectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
}

const AssignedProjectsModal = ({ isOpen, onClose, projects }: AssignedProjectsModalProps) => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate('/student/projects');
    onClose();
  };

  const handleViewProject = (projectId: string) => {
    navigate(`/projects/${projectId}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-primary" />
            Your Assigned Projects
          </DialogTitle>
          <DialogDescription>
            {projects.length > 0 
              ? "Here are the projects that have been assigned to your group."
              : "You don't have any assigned projects yet."}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto py-4">
          {projects.length === 0 ? (
            <div className="text-center py-6">
              <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground/60" />
              <p className="mt-4 text-muted-foreground">No projects assigned yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map(project => (
                <div 
                  key={project.id}
                  className="glass-card rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleViewProject(project.id)}
                >
                  <h3 className="font-semibold">{project.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {project.description}
                  </p>
                  
                  {/* Simple progress indicator */}
                  {project.tasks && (
                    <div className="mt-3">
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span>Progress</span>
                        <span>
                          {project.tasks.filter(t => t.isCompleted).length}/{project.tasks.length} tasks
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ 
                            width: `${project.tasks.length > 0 
                              ? (project.tasks.filter(t => t.isCompleted).length / project.tasks.length) * 100 
                              : 0}%` 
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleViewAll}>
            View All Projects
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignedProjectsModal;
