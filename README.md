# 📚 Class Project Tracker

A web platform designed to help teachers assign tasks to student groups, and for students to track their progress, submit work proofs, and compete on a leaderboard. Built with **React** and **Supabase**.

## 🚀 Features

- 🧑‍🏫 **Admin Dashboard** (for teachers)
  - Create and manage projects
  - Assign tasks to groups
  - Review submissions with options to approve or reject
  - Award scores and update leaderboard

- 👨‍🎓 **Student Dashboard**
  - Join a group
  - View assigned tasks
  - Submit proofs (image + description)
  - Track group progress via a visual progress bar
  - Compete on a live leaderboard

## 🛠️ Tech Stack

- **Frontend**: React + Tailwind CSS
- **Backend/Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth

## 🗂️ Database Schema (Supabase)

- `profiles`: User data (role: student/teacher)
- `groups`: Group details
- `group_members`: Links users to groups
- `projects`: Class project definitions
- `tasks`: Tasks assigned to each project
- `submissions`: Proofs submitted by students
- `leaderboard`: Calculated leaderboard data

## 📦 Setup Instructions

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-username/class-project-tracker.git
   cd class-project-tracker
npm install
Configure Supabase

    Create a Supabase project

    Set up tables according to the schema above

    Add your Supabase URL and anon key to a .env file:

VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-anon-key

Run the app

npm run dev
🙌 Contributions

Feel free to fork this repo and submit pull requests or open issues!
