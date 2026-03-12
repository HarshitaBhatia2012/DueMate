import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AssignmentProvider } from './context/AssignmentContext';
import { AuthProvider, useAuth } from './context/AuthContext';
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

// Global Styles
import './index.css';
import './styles/layout.css';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

function App() {
  return (
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
              <Route path="/settings" element={<Navigate to="/dashboard" />} />
              
              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Router>
        </AssignmentProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
