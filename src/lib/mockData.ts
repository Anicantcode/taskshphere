
import { Project, Task } from './types';

// Mock data for projects
export const allProjects: Project[] = [
  {
    id: '1',
    title: 'Web Development Basics',
    description: 'Learn the fundamentals of HTML, CSS, and JavaScript through hands-on projects.',
    teacherId: '1',
    groupId: '1',
    groupName: 'Group 1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tasks: [
      {
        id: '1',
        projectId: '1',
        title: 'Create a personal portfolio',
        description: 'Design and implement a personal portfolio website using HTML and CSS.',
        isCompleted: true,
      },
      {
        id: '2',
        projectId: '1',
        title: 'JavaScript Calculator',
        description: 'Build a functional calculator with JavaScript.',
        isCompleted: false,
      },
    ],
  },
  {
    id: '2',
    title: 'Mobile App Design',
    description: 'Design and prototype a mobile application focusing on user experience and interface.',
    teacherId: '1',
    groupId: '2',
    groupName: 'Group 2',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    tasks: [
      {
        id: '4',
        projectId: '2',
        title: 'User Research',
        description: 'Conduct user research to understand the target audience.',
        isCompleted: true,
      },
      {
        id: '5',
        projectId: '2',
        title: 'Wireframing',
        description: 'Create wireframes for the mobile application.',
        isCompleted: true,
      },
    ],
  },
  {
    id: '3',
    title: 'Data Science Fundamentals',
    description: 'Introduction to data analysis, visualization, and basic machine learning concepts.',
    teacherId: '1',
    groupId: '3',
    groupName: 'Group 3',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    tasks: [
      {
        id: '7',
        projectId: '3',
        title: 'Data Cleaning',
        description: 'Clean and prepare a dataset for analysis.',
        isCompleted: true,
      },
      {
        id: '8',
        projectId: '3',
        title: 'Exploratory Data Analysis',
        description: 'Perform exploratory data analysis and create visualizations.',
        isCompleted: false,
      },
    ],
  },
  {
    id: '4',
    title: 'Cybersecurity Workshop',
    description: 'Explore common security vulnerabilities and implement protection strategies.',
    teacherId: '1',
    groupId: '4',
    groupName: 'Group 4',
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    tasks: [
      {
        id: '9',
        projectId: '4',
        title: 'Network Security Audit',
        description: 'Perform a basic security audit on a sample network.',
        isCompleted: true,
      },
      {
        id: '10',
        projectId: '4',
        title: 'Password Policy Implementation',
        description: 'Design and document a secure password policy.',
        isCompleted: true,
      },
    ],
  },
  {
    id: '5',
    title: 'Mobile App Development',
    description: 'Create a fully functional mobile app using React Native.',
    teacherId: '1',
    groupId: '5',
    groupName: 'Group 5',
    createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    tasks: [
      {
        id: '11',
        projectId: '5',
        title: 'App Planning and Wireframing',
        description: 'Plan the app structure and create wireframes.',
        isCompleted: true,
      },
      {
        id: '12',
        projectId: '5',
        title: 'App Implementation',
        description: 'Build the React Native application.',
        isCompleted: false,
      },
    ],
  },
];

// Mock tasks for upcoming deadlines
export const upcomingTasks: Task[] = [
  {
    id: '2',
    projectId: '1',
    title: 'JavaScript Calculator',
    description: 'Build a functional calculator with JavaScript.',
    isCompleted: false,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    projectId: '2',
    title: 'High-fidelity Prototype',
    description: 'Design a high-fidelity prototype using Figma or Adobe XD.',
    isCompleted: false,
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    projectId: '1',
    title: 'Responsive Navigation',
    description: 'Create a responsive navigation menu that works on all devices.',
    isCompleted: false,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
