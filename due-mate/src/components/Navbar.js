import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckSquare, Sun, Moon } from 'lucide-react';
import { UserButton } from '@clerk/clerk-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isLanding ? 'is-landing' : ''} ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <CheckSquare className="logo-icon" size={24} />
          <span className="logo-text">DueMate</span>
        </Link>

        <div className="navbar-links">
          <button className="theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          
          {isLanding && !isAuthenticated ? (
            <>
              <Link to="/login" className="btn btn-outline navbar-btn">Login</Link>
              <Link to="/signup" className="btn btn-primary navbar-btn">Sign up</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <div className="nav-profile-container">
                <UserButton 
                  afterSignOutUrl="/" 
                  userProfileMode="navigation"
                  userProfileUrl="/profile"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

