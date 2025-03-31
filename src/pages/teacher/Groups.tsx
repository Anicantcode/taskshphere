
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { allProjects } from '@/lib/mockData';
import { Search, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

// Extract unique groups from the projects
const extractGroups = () => {
  const groupsMap = new Map();
  
  allProjects.forEach(project => {
    if (!groupsMap.has(project.groupId)) {
      groupsMap.set(project.groupId, {
        id: project.groupId,
        name: project.groupName || `Group ${project.groupId}`,
        projects: []
      });
    }
    
    groupsMap.get(project.groupId).projects.push({
      id: project.id,
      title: project.title,
      description: project.description,
      tasksCount: project.tasks?.length || 0,
      completedTasksCount: project.tasks?.filter(task => task.isCompleted).length || 0,
    });
  });
  
  return Array.from(groupsMap.values());
};

const TeacherGroups = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const groups = extractGroups();
  
  // Filter groups based on search query
  const filteredGroups = groups.filter(
    group =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.projects.some(project => 
        project.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={isSidebarOpen} />
      
      <div className="flex-1 flex flex-col ml-0 sm:ml-16 transition-all duration-300 ease-in-out">
        <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 py-8 px-6 animate-fadeIn">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Groups</h1>
                <p className="text-muted-foreground">
                  View all student groups and their assigned projects
                </p>
              </div>
            </div>
            
            {/* Search */}
            <div className="mb-8 glass-card rounded-lg p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search groups or projects..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
              </div>
            </div>
            
            {/* Groups List */}
            {filteredGroups.length === 0 ? (
              <div className="glass-card rounded-xl p-8 text-center">
                <Users className="mx-auto h-12 w-12 text-muted-foreground/60" />
                <h3 className="mt-4 text-xl font-semibold">No groups found</h3>
                <p className="mt-2 text-muted-foreground">
                  {searchQuery
                    ? "We couldn't find any groups matching your search."
                    : "No groups have been created yet."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredGroups.map(group => (
                  <Card key={group.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2 bg-primary/5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/20 p-2.5 rounded-full">
                            <Users className="h-6 w-6 text-primary" />
                          </div>
                          <CardTitle className="text-2xl font-bold text-primary/90">
                            {group.name}
                          </CardTitle>
                        </div>
                        <CardDescription className="text-sm font-medium mt-0 bg-primary/10 px-3 py-1 rounded-full">
                          {group.projects.length} {group.projects.length === 1 ? 'Project' : 'Projects'} Assigned
                        </CardDescription>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-4">
                      <Tabs defaultValue="projects" className="w-full">
                        <TabsList className="mb-4">
                          <TabsTrigger value="projects">Assigned Projects</TabsTrigger>
                          <TabsTrigger value="progress">Progress</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="projects">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Project</TableHead>
                                <TableHead className="hidden sm:table-cell">Description</TableHead>
                                <TableHead>Tasks</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {group.projects.map(project => (
                                <TableRow key={project.id}>
                                  <TableCell className="font-medium">{project.title}</TableCell>
                                  <TableCell className="truncate max-w-[300px] hidden sm:table-cell">
                                    {project.description}
                                  </TableCell>
                                  <TableCell>
                                    {project.completedTasksCount} / {project.tasksCount} completed
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TabsContent>
                        
                        <TabsContent value="progress">
                          {group.projects.map(project => {
                            const progressPercent = project.tasksCount > 0 
                              ? Math.round((project.completedTasksCount / project.tasksCount) * 100) 
                              : 0;
                              
                            return (
                              <div key={project.id} className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-medium text-base">{project.title}</h4>
                                  <span className="text-sm text-muted-foreground">
                                    {progressPercent}%
                                  </span>
                                </div>
                                <Progress value={progressPercent} className="h-2" />
                                <p className="text-sm text-muted-foreground mt-1">
                                  {project.completedTasksCount} of {project.tasksCount} tasks completed
                                </p>
                              </div>
                            );
                          })}
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeacherGroups;
