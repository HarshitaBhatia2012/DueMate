import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn, useAuth as useClerkAuth, useUser } from '@clerk/clerk-react';
import { AssignmentProvider } from './context/AssignmentContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import AddEditAssignment from './pages/AddEditAssignment';
import MyTasks from './pages/Tasks';
import CalendarView from './pages/Calendar';
import Analytics from './pages/Analytics';
import ProfilePage from './pages/ProfilePage';
import Settings from './pages/Settings';


// Global Styles
import './index.css';
import './styles/layout.css';

// Clerk Publishable Key
const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

// Protected Route Wrapper using Clerk
const ProtectedRoute = ({ children }) => {
  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ThemeProvider>
        <AuthProvider>
          <AssignmentProvider>
            <Router>
              <div className="app">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  
                  {/* Protected Routes */}
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/add-assignment" element={<ProtectedRoute><AddEditAssignment /></ProtectedRoute>} />
                  <Route path="/edit-assignment/:id" element={<ProtectedRoute><AddEditAssignment /></ProtectedRoute>} />
                  <Route path="/tasks" element={<ProtectedRoute><MyTasks /></ProtectedRoute>} />
                  <Route path="/calendar" element={<ProtectedRoute><CalendarView /></ProtectedRoute>} />
                  <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                  
                  {/* Mock routes for sidebar links to prevent 404s in this demo */}
                  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

                  
                  {/* Catch all */}
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </div>
            </Router>
          </AssignmentProvider>
        </AuthProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}

export default App;

