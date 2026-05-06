import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { CheckSquare } from 'lucide-react';
import '../styles/LoginPage.css';

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <Link to="/" className="login-logo">
            <CheckSquare className="logo-icon" size={32} />
          </Link>
          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">Sign in to your DueMate account to continue.</p>
        </div>

        <div className="clerk-auth-wrapper">
          <SignIn
            routing="path"
            path="/login"
            signUpUrl="/signup"
            fallbackRedirectUrl="/dashboard"
          />
        </div>

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

export default LoginPage;

