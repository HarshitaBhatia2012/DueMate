import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { UserProfile } from '@clerk/clerk-react';
import '../styles/Dashboard.css';

const ProfilePage = () => {
  const navigate = useNavigate();

  return (
    <div className="profile-container-wrapper">
      <div className="profile-content-inner">
        <div className="profile-page-header">
          <button className="back-button-modern" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
            <span>Dashboard</span>
          </button>
          <h1 className="profile-main-title">My Profile</h1>
        </div>

        <div className="profile-clerk-wrapper">
          <UserProfile routing="path" path="/profile" />
        </div>
      </div>
      
      <style>{`
        .profile-container-wrapper {
          min-height: 100vh;
          padding: 100px 2rem 4rem;
          background: var(--bg-color);
          display: flex;
          justify-content: center;
        }

        .profile-content-inner {
          width: 100%;
          max-width: 900px;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .profile-page-header {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .back-button-modern {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.8rem;
          background: var(--surface-color);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .profile-main-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .profile-clerk-wrapper {
          width: 100%;
        }

        /* Adjusting Clerk UserProfile to fit the theme if possible */
        .cl-rootBox {
          width: 100%;
        }
        .cl-card {
           box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03) !important;
           border: 1px solid var(--border-color) !important;
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;

