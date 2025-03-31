
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TeacherProjects from "./pages/teacher/Projects";
import TeacherSubmissions from "./pages/teacher/Submissions";
import StudentProjects from "./pages/student/Projects";
import StudentTasks from "./pages/student/Tasks";
import ProjectDetails from "./pages/ProjectDetails";
import Leaderboard from "./pages/student/Leaderboard";
import NotFound from "./pages/NotFound";
import { Suspense } from "react";
import LoadingSpinner from "./components/ui/LoadingSpinner";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: 'teacher' | 'student' }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If a specific role is required, check if the user has that role
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
              </div>
            }
          >
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Shared protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              
              {/* Project details page - accessible to both roles */}
              <Route
                path="/projects/:id"
                element={
                  <ProtectedRoute>
                    <ProjectDetails />
                  </ProtectedRoute>
                }
              />
              
              {/* Teacher-specific routes */}
              <Route
                path="/teacher/projects"
                element={
                  <ProtectedRoute requiredRole="teacher">
                    <TeacherProjects />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teacher/submissions"
                element={
                  <ProtectedRoute requiredRole="teacher">
                    <TeacherSubmissions />
                  </ProtectedRoute>
                }
              />
              
              {/* Student-specific routes */}
              <Route
                path="/student/projects"
                element={
                  <ProtectedRoute requiredRole="student">
                    <StudentProjects />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/tasks"
                element={
                  <ProtectedRoute requiredRole="student">
                    <StudentTasks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/leaderboard"
                element={
                  <ProtectedRoute requiredRole="student">
                    <Leaderboard />
                  </ProtectedRoute>
                }
              />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
