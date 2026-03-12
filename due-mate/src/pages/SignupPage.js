import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/FormInput';
import '../styles/LoginPage.css'; // Reuse Login styles for container

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
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
          <h1 className="login-title">Create an account</h1>
          <p className="login-subtitle">Join DueMate to start mastering your deadlines.</p>
        </div>
        
        <form className="login-form card" onSubmit={handleSignup}>
          {error && <div className="form-error-banner">{error}</div>}
          
          <FormInput
            id="username"
            label="Username"
            placeholder="johndoe"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <FormInput
            id="email"
            type="email"
            label="Email address"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <FormInput
            id="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <FormInput
            id="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          
          <button type="submit" className="btn btn-primary login-btn">
            Create account
          </button>
        </form>
        
        <p className="login-footer">
          Already have an account? <Link to="/login" className="signup-link">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
