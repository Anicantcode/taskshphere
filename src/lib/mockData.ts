import { Project, Task, Submission } from './types';

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

// Mock submissions data
export const allSubmissions: Submission[] = [
  {
    id: "sub-001",
    taskId: "1",
    groupId: "1",
    content: "Completed portfolio with responsive design and modern UI",
    contentType: "text",
    status: "approved",
    submittedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    reviewedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    feedback: "Excellent work! Your portfolio demonstrates good use of HTML and CSS principles."
  },
  {
    id: "sub-002",
    taskId: "2",
    groupId: "1",
    content: "JavaScript calculator with basic and scientific functions",
    contentType: "text",
    status: "pending",
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "sub-003",
    taskId: "4",
    groupId: "2",
    content: "User research report with personas and user journey maps",
    contentType: "text",
    status: "approved",
    submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    reviewedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    feedback: "Thorough research with actionable insights. Well done!"
  },
  {
    id: "sub-004",
    taskId: "5",
    groupId: "2",
    content: "Wireframes for mobile application",
    contentType: "text",
    status: "rejected",
    submittedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    reviewedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    feedback: "The wireframes need more detail and better consideration of user flow. Please revise."
  },
  {
    id: "sub-005",
    taskId: "7",
    groupId: "3",
    content: "Cleaned dataset with documentation of the process",
    contentType: "text",
    status: "approved",
    submittedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    reviewedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    feedback: "Good data cleaning techniques. Documentation is clear and thorough."
  },
  {
    id: "sub-006",
    taskId: "8",
    groupId: "3",
    content: "Exploratory data analysis with visualizations",
    contentType: "text",
    status: "pending",
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "sub-007",
    taskId: "9",
    groupId: "4",
    content: "Network security audit report",
    contentType: "text",
    status: "approved",
    submittedAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
    reviewedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    feedback: "Comprehensive security audit with good recommendations."
  },
  {
    id: "sub-008",
    taskId: "10",
    groupId: "4",
    content: "Password policy documentation",
    contentType: "text",
    status: "rejected",
    submittedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    reviewedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    feedback: "The password policy needs to be more comprehensive and include multi-factor authentication considerations."
  },
  {
    id: "sub-009",
    taskId: "11",
    groupId: "5",
    content: "App planning document and wireframes",
    contentType: "text",
    status: "approved",
    submittedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
    reviewedAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
    feedback: "Well-thought-out app structure and clear wireframes."
  },
  {
    id: "sub-010",
    taskId: "12",
    groupId: "5",
    content: "React Native application initial build",
    contentType: "text",
    status: "pending",
    submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  }
];
