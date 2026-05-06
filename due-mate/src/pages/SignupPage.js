import React from 'react';
import { SignUp } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { CheckSquare } from 'lucide-react';
import '../styles/LoginPage.css';

const SignupPage = () => {
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
        
        <div className="clerk-auth-wrapper">
          <SignUp 
            routing="path" 
            path="/signup" 
            signInUrl="/login"
            fallbackRedirectUrl="/dashboard"
          />
        </div>
        
        <p className="login-footer">
          Already have an account? <Link to="/login" className="signup-link">Sign in</Link>
        </p>
      </div>
      
      <style>{`
        .clerk-auth-wrapper {
          display: flex;
          justify-content: center;
          margin-top: 2rem;
        }
        .clerk-auth-wrapper > div {
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
          border-radius: 12px;
        }
      `}</style>
    </div>
  );
};

export default SignupPage;

