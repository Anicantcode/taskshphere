
export type UserRole = 'teacher' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Group {
  id: string;
  name: string;
  createdBy: string; // Teacher ID
  students?: User[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  groupId: string;
  createdAt: string;
  updatedAt: string;
  tasks?: Task[];
  groupName?: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  isCompleted: boolean;
  dueDate?: string;
  submissions?: Submission[];
}

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface Submission {
  id: string;
  taskId: string;
  groupId: string;
  content: string;
  contentType: 'text' | 'image';
  status: SubmissionStatus;
  submittedAt: string;
  reviewedAt?: string;
  feedback?: string;
}

export interface LeaderboardEntry {
  id: string;
  groupId: string;
  groupName: string;
  completedTasks: number;
  timeToComplete: string;
  ranking: number;
}
