import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CheckSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/FormInput';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <Link to="/" className="login-logo">
            <CheckSquare className="logo-icon" size={32} />
          </Link>
          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">Enter your details to access your account.</p>
        </div>
        
        <form className="login-form card" onSubmit={handleLogin}>
          {successMessage && <div className="form-success-banner">{successMessage}</div>}
          {error && <div className="form-error-banner">{error}</div>}
          <FormInput
            id="username"
            type="text"
            label="Username"
            placeholder="johndoe"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          
          <FormInput
            id="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <div className="login-options">
            <label className="checkbox-label">
              <input type="checkbox" className="checkbox-input" />
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>
          
          <button type="submit" className="btn btn-primary login-btn">
            Sign in
          </button>
        </form>
        
        <p className="login-footer">
          Don't have an account? <Link to="/signup" className="signup-link">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
