
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { LeaderboardEntry } from '@/lib/types';
import { Trophy, ArrowUp, ArrowDown, Minus, Medal, Clock, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Mock leaderboard data
const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: '1',
    groupId: '3',
    groupName: 'Data Explorers',
    completedTasks: 42,
    timeToComplete: '14.5',
    ranking: 1,
  },
  {
    id: '2',
    groupId: '1',
    groupName: 'Web Wizards',
    completedTasks: 38,
    timeToComplete: '15.2',
    ranking: 2,
  },
  {
    id: '3',
    groupId: '4',
    groupName: 'Security Guardians',
    completedTasks: 35,
    timeToComplete: '16.8',
    ranking: 3,
  },
  {
    id: '4',
    groupId: '2',
    groupName: 'UX Designers',
    completedTasks: 33,
    timeToComplete: '17.3',
    ranking: 4,
  },
  {
    id: '5',
    groupId: '5',
    groupName: 'AI Innovators',
    completedTasks: 30,
    timeToComplete: '18.5',
    ranking: 5,
  },
];

// Function to determine ranking change icon and color
const getRankingChange = (ranking: number) => {
  // Mock ranking changes
  const changes: Record<number, { change: number; icon: React.ReactNode; color: string }> = {
    1: { change: 0, icon: <Minus size={14} />, color: 'text-yellow-500' },
    2: { change: 1, icon: <ArrowUp size={14} />, color: 'text-green-500' },
    3: { change: -1, icon: <ArrowDown size={14} />, color: 'text-red-500' },
    4: { change: 2, icon: <ArrowUp size={14} />, color: 'text-green-500' },
    5: { change: 0, icon: <Minus size={14} />, color: 'text-yellow-500' },
  };
  
  return changes[ranking] || { change: 0, icon: <Minus size={14} />, color: 'text-yellow-500' };
};

// Function to get medal for top 3
const getMedal = (ranking: number) => {
  switch (ranking) {
    case 1:
      return <Medal className="h-6 w-6 text-yellow-500" />;
    case 2:
      return <Medal className="h-6 w-6 text-gray-400" />;
    case 3:
      return <Medal className="h-6 w-6 text-amber-700" />;
    default:
      return <span className="font-semibold">{ranking}</span>;
  }
};

// Recent achievements for your group
const recentAchievements = [
  {
    id: '1',
    title: 'Completed 5 tasks in one day',
    date: '2 days ago',
    icon: <CheckCircle className="h-5 w-5 text-green-500" />,
  },
  {
    id: '2',
    title: 'Fastest submission for JavaScript Calculator',
    date: '1 week ago',
    icon: <Clock className="h-5 w-5 text-blue-500" />,
  },
  {
    id: '3',
    title: 'First group to complete Web Development Basics',
    date: '2 weeks ago',
    icon: <Trophy className="h-5 w-5 text-yellow-500" />,
  },
];

const Leaderboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userGroup] = useState('Web Wizards'); // Mock user's group

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLeaderboard(mockLeaderboard);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={isSidebarOpen} />
      
      <div className="flex-1 flex flex-col ml-0 sm:ml-16 transition-all duration-300 ease-in-out">
        <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 py-8 px-6 animate-fadeIn">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight mb-2">Leaderboard</h1>
              <p className="text-muted-foreground">
                Track your group's performance and see how you rank against other groups
              </p>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  {/* Leaderboard Table */}
                  <div className="glass-card rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-border">
                      <h2 className="text-xl font-semibold flex items-center">
                        <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
                        Group Rankings
                      </h2>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-primary/5">
                            <th className="text-left font-medium text-muted-foreground p-4">#</th>
                            <th className="text-left font-medium text-muted-foreground p-4">Group</th>
                            <th className="text-center font-medium text-muted-foreground p-4">Tasks Completed</th>
                            <th className="text-center font-medium text-muted-foreground p-4">Avg. Time (hours)</th>
                            <th className="text-center font-medium text-muted-foreground p-4">Change</th>
                          </tr>
                        </thead>
                        <tbody>
                          {leaderboard.map(entry => {
                            const isUserGroup = entry.groupName === userGroup;
                            const rankingChange = getRankingChange(entry.ranking);
                            
                            return (
                              <tr 
                                key={entry.id} 
                                className={cn(
                                  "border-b border-border last:border-0 transition-colors",
                                  isUserGroup && "bg-primary/10"
                                )}
                              >
                                <td className="p-4 text-center">
                                  <div className="flex justify-center">
                                    {getMedal(entry.ranking)}
                                  </div>
                                </td>
                                <td className="p-4">
                                  <div className="font-medium flex items-center">
                                    {isUserGroup && (
                                      <div className="w-2 h-2 bg-primary rounded-full mr-2" />
                                    )}
                                    {entry.groupName}
                                    {isUserGroup && <span className="ml-2 text-xs text-primary">(You)</span>}
                                  </div>
                                </td>
                                <td className="p-4 text-center">{entry.completedTasks}</td>
                                <td className="p-4 text-center">{entry.timeToComplete}</td>
                                <td className="p-4">
                                  <div className={cn("flex items-center justify-center", rankingChange.color)}>
                                    {rankingChange.icon}
                                    <span className="ml-1">
                                      {rankingChange.change === 0 
                                        ? "No change" 
                                        : rankingChange.change > 0 
                                          ? `+${rankingChange.change}` 
                                          : rankingChange.change}
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                
                <div>
                  {/* Your Group's Recent Achievements */}
                  <div className="glass-card rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-border">
                      <h2 className="text-xl font-semibold">Recent Achievements</h2>
                    </div>
                    
                    <div className="p-4">
                      <ul className="space-y-4">
                        {recentAchievements.map(achievement => (
                          <li 
                            key={achievement.id}
                            className="flex items-start p-3 rounded-lg hover:bg-primary/5 transition-colors"
                          >
                            <div className="flex-shrink-0 mr-3 mt-0.5">
                              {achievement.icon}
                            </div>
                            <div>
                              <p className="font-medium">{achievement.title}</p>
                              <p className="text-sm text-muted-foreground">{achievement.date}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Performance Summary */}
                  <div className="glass-card rounded-xl overflow-hidden mt-6">
                    <div className="p-6 border-b border-border">
                      <h2 className="text-xl font-semibold">Your Performance</h2>
                    </div>
                    
                    <div className="p-6">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Task Completion Rate</span>
                            <span className="text-sm font-medium">85%</span>
                          </div>
                          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }} />
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Submission Quality</span>
                            <span className="text-sm font-medium">92%</span>
                          </div>
                          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: '92%' }} />
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Time Efficiency</span>
                            <span className="text-sm font-medium">78%</span>
                          </div>
                          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-500 rounded-full" style={{ width: '78%' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Leaderboard;
