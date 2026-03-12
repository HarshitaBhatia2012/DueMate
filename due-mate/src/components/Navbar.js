import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckSquare, LogOut, User, ChevronDown, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isLanding = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    window.location.href = '/';
  };

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
              <div className="nav-profile-container" ref={dropdownRef}>
                <div className="user-profile" onClick={toggleDropdown} title="My Profile">
                  <div className="avatar">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <ChevronDown size={14} className={`dropdown-arrow ${showDropdown ? 'open' : ''}`} />
                </div>

                {showDropdown && (
                  <div className="profile-dropdown">
                    <div className="dropdown-header">
                      Hi, {user?.username || 'User'}!
                    </div>
                    <Link to="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                      <User size={16} />
                      <span>My Profile</span>
                    </Link>
                    <button className="dropdown-item logout" onClick={handleLogout}>
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
