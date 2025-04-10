import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { Search } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

// Mock student data
const mockStudents = [
  { id: '1', name: 'Alice Johnson', points: 2850 },
  { id: '2', name: 'Bob Smith', points: 2600 },
  { id: '3', name: 'Charlie Brown', points: 2400 },
  { id: '4', name: 'David Miller', points: 2250 },
  { id: '5', name: 'Eve Davis', points: 2100 },
  { id: '6', name: 'Fiona White', points: 1950 },
  { id: '7', name: 'George Black', points: 1800 },
  { id: '8', name: 'Hannah Green', points: 1650 },
  { id: '9', name: 'Ian Gray', points: 1500 },
  { id: '10', name: 'Jack Blue', points: 1350 },
];

const Leaderboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Filter students based on search query
  const filteredStudents = mockStudents.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col ml-0 sm:ml-16 transition-all duration-300 ease-in-out">
        <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 py-8 px-6 animate-fadeIn">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight mb-2">Leaderboard</h1>
              <p className="text-muted-foreground">
                See how you rank among your peers
              </p>
            </div>
            
            {/* Search */}
            <div className="mb-8 glass-card rounded-lg p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
              </div>
            </div>
            
            {/* Leaderboard Table */}
            <div className="glass-card rounded-xl overflow-hidden">
              <Table>
                <TableCaption>A list of students and their points.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Rank</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.sort((a, b) => b.points - a.points).map((student, index) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.points}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Leaderboard;
