
import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowRight, ChevronRight, Users, FolderKanban, ListTodo, Trophy } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col animate-fadeIn">
      {/* Header/Navigation */}
      <header className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <a href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold">TM</span>
            </div>
            <span className="font-semibold">TaskMaster</span>
          </a>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#testimonials" className="nav-link">Testimonials</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn-primary">Get Started</Link>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-8">
            <div>
              <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
                <span>New Platform for Educators</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tighter mb-4">
                Manage classroom projects with ease
              </h1>
              <p className="text-xl text-muted-foreground max-w-xl">
                TaskMaster helps teachers create engaging project-based learning experiences and 
                keeps students motivated with real-time feedback and leaderboards.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="btn-primary flex items-center justify-center gap-2 text-lg py-3">
                <span>Get Started</span>
                <ArrowRight size={18} />
              </Link>
              <a href="#how-it-works" className="btn-secondary flex items-center justify-center gap-2 text-lg py-3">
                Learn More
              </a>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                <span>Free for educators</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 glass-card rounded-xl p-1 shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="TaskMaster Dashboard Preview" 
              className="rounded-lg w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-secondary/50">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
              <span>Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to manage classroom projects</h2>
            <p className="text-xl text-muted-foreground">
              Powerful tools for teachers and students that make project-based learning more effective and engaging.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-lg">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <FolderKanban className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Project Management</h3>
              <p className="text-muted-foreground">
                Create, assign, and track projects with multiple tasks and deadlines.
              </p>
              <a href="#" className="inline-flex items-center text-primary mt-4">
                <span>Learn more</span>
                <ChevronRight size={16} />
              </a>
            </div>
            
            {/* Feature 2 */}
            <div className="glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-lg">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                <ListTodo className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Task Submission</h3>
              <p className="text-muted-foreground">
                Students can submit work as text or images with integrated feedback system.
              </p>
              <a href="#" className="inline-flex items-center text-primary mt-4">
                <span>Learn more</span>
                <ChevronRight size={16} />
              </a>
            </div>
            
            {/* Feature 3 */}
            <div className="glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-lg">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Group Collaboration</h3>
              <p className="text-muted-foreground">
                Organize students into groups for collaborative project work and team learning.
              </p>
              <a href="#" className="inline-flex items-center text-primary mt-4">
                <span>Learn more</span>
                <ChevronRight size={16} />
              </a>
            </div>
            
            {/* Feature 4 */}
            <div className="glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-lg">
              <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center mb-4">
                <Trophy className="h-6 w-6 text-yellow-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Interactive Leaderboard</h3>
              <p className="text-muted-foreground">
                Real-time leaderboard updates to motivate students and foster healthy competition.
              </p>
              <a href="#" className="inline-flex items-center text-primary mt-4">
                <span>Learn more</span>
                <ChevronRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
              <span>How It Works</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple steps to transform your classroom</h2>
            <p className="text-xl text-muted-foreground">
              TaskMaster makes it easy to implement project-based learning in your classroom.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Create Projects</h3>
              <p className="text-muted-foreground">
                Teachers create projects with detailed descriptions, tasks, and deadlines.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Assign to Groups</h3>
              <p className="text-muted-foreground">
                Organize students into collaborative groups and assign projects to them.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Track Progress</h3>
              <p className="text-muted-foreground">
                Monitor submissions, provide feedback, and watch the leaderboard update in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6 bg-secondary/50">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
              <span>Testimonials</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What educators are saying</h2>
            <p className="text-xl text-muted-foreground">
              Hear from teachers who have transformed their classrooms with TaskMaster.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center mb-4">
                <div className="mr-3 h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary font-semibold">MS</span>
                </div>
                <div>
                  <h4 className="font-semibold">Maria Santiago</h4>
                  <p className="text-sm text-muted-foreground">Computer Science Teacher</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "TaskMaster has revolutionized my classroom. My students are more engaged and motivated to complete their projects on time."
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center mb-4">
                <div className="mr-3 h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-green-500 font-semibold">JT</span>
                </div>
                <div>
                  <h4 className="font-semibold">James Thompson</h4>
                  <p className="text-sm text-muted-foreground">Physics Teacher</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "The leaderboard feature has created a positive competitive environment in my classroom. Students are excited to complete tasks quickly and accurately."
              </p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-center mb-4">
                <div className="mr-3 h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <span className="text-blue-500 font-semibold">LW</span>
                </div>
                <div>
                  <h4 className="font-semibold">Lisa Wong</h4>
                  <p className="text-sm text-muted-foreground">English Teacher</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                "TaskMaster has made group projects so much easier to manage. I can quickly see who's contributing and provide timely feedback."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl glass-card rounded-2xl p-10 bg-gradient-to-r from-primary/10 to-blue-500/10">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to transform your classroom?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of educators who are using TaskMaster to create engaging, project-based learning experiences.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register" className="btn-primary flex items-center justify-center gap-2 text-lg py-3 px-8">
                Get Started for Free
              </Link>
              <a href="#how-it-works" className="btn-secondary flex items-center justify-center gap-2 text-lg py-3 px-8">
                Schedule a Demo
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-secondary/50 py-12 px-6 border-t border-border">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                  <span className="text-primary-foreground font-bold">TM</span>
                </div>
                <span className="font-semibold">TaskMaster</span>
              </div>
              <p className="text-muted-foreground max-w-xs">
                Empowering educators to create engaging project-based learning experiences.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold mb-4">Platform</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-primary">Features</a></li>
                  <li><a href="#" className="hover:text-primary">Pricing</a></li>
                  <li><a href="#" className="hover:text-primary">Testimonials</a></li>
                  <li><a href="#" className="hover:text-primary">FAQ</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Resources</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-primary">Blog</a></li>
                  <li><a href="#" className="hover:text-primary">Documentation</a></li>
                  <li><a href="#" className="hover:text-primary">Guides</a></li>
                  <li><a href="#" className="hover:text-primary">Support</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-primary">About Us</a></li>
                  <li><a href="#" className="hover:text-primary">Careers</a></li>
                  <li><a href="#" className="hover:text-primary">Contact</a></li>
                  <li><a href="#" className="hover:text-primary">Legal</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} TaskMaster. All rights reserved.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-muted-foreground hover:text-primary">
                Terms
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                Privacy
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
