import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Edit2, Save, X, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import FormInput from '../components/FormInput';
import '../styles/Dashboard.css'; // Reuse some dashboard layout styles

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        password: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const updateData = {
        username: formData.username,
        email: formData.email
      };
      if (formData.password) {
        updateData.password = formData.password;
      }

      const updatedUser = await authService.updateCurrentUser(updateData);
      // We need a way to update the user in AuthContext. 
      // Assuming AuthContext has a setUser method if we add it.
      // For now, let's refresh or rely on the next session.
      // Better: let's hope AuthContext has setUser. 
      // I added 'user' to AuthContext but forgot to export 'setUser'.
      // I'll fix AuthContext in a moment.
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setFormData({ ...formData, password: '' });
      setUser(updatedUser); 
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="loading">Loading...</div>;

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

        <div className="profile-glass-card">
          <div className="profile-hero-section">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar-glow"></div>
              <div className="profile-avatar-main">
                {user.username.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="profile-meta-info">
              <h2 className="profile-name-display">{user.username}</h2>
              <div className="profile-email-badge">
                <Mail size={14} />
                <span>{user.email}</span>
              </div>
            </div>
            {!isEditing && (
              <button className="edit-action-btn" onClick={() => setIsEditing(true)}>
                <Edit2 size={16} />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          <div className="profile-divider"></div>

          <form className="profile-modern-form" onSubmit={handleUpdate}>
            {error && <div className="profile-alert error">{error}</div>}
            {success && <div className="profile-alert success">{success}</div>}

            <div className="profile-form-grid">
              <div className="form-group-modern">
                <label className="input-label-premium">Account Identity</label>
                <FormInput
                  id="username"
                  label="Username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="form-group-modern">
                <label className="input-label-premium">Contact Information</label>
                <FormInput
                  id="email"
                  type="email"
                  label="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              {isEditing && (
                <div className="form-group-modern full-width animate-in">
                  <label className="input-label-premium">Security Update</label>
                  <FormInput
                    id="password"
                    type="password"
                    label="New Password"
                    placeholder="Leave blank to keep current"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>

            {isEditing && (
              <div className="profile-form-footer animate-in">
                <button type="button" className="btn-modern secondary" onClick={() => setIsEditing(false)}>
                  <X size={16} />
                  <span>Discard</span>
                </button>
                <button type="submit" className="btn-modern primary" disabled={loading}>
                  {loading ? (
                    <div className="spinner-small"></div>
                  ) : (
                    <>
                      <Save size={16} />
                      <span>Update Profile</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
      
      <style>{`
        .profile-container-wrapper {
          min-height: 100vh;
          padding: 100px 2rem 4rem;
          background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.05), transparent),
                      radial-gradient(circle at bottom left, rgba(79, 70, 229, 0.05), transparent),
                      var(--bg-color);
          display: flex;
          justify-content: center;
        }

        .profile-content-inner {
          width: 100%;
          max-width: 800px;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .profile-page-header {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .back-button-modern {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--surface-color);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .back-button-modern:hover {
          transform: translateX(-4px);
          color: var(--primary-color);
          border-color: var(--primary-color);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.1);
        }

        .profile-main-title {
          font-size: 2.5rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--text-primary);
          margin: 0;
        }

        .profile-glass-card {
          background: var(--surface-color);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid var(--border-color);
          border-radius: 24px;
          padding: 3rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
          position: relative;
          overflow: hidden;
        }

        .profile-hero-section {
          display: flex;
          align-items: center;
          gap: 2.5rem;
          margin-bottom: 3rem;
        }

        .profile-avatar-wrapper {
          position: relative;
          width: 120px;
          height: 120px;
        }

        .profile-avatar-main {
          width: 100%;
          height: 100%;
          border-radius: 32px;
          background: linear-gradient(135deg, var(--primary-color), #4f46e5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3.5rem;
          font-weight: 700;
          color: white;
          box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
          position: relative;
          z-index: 2;
        }

        .profile-avatar-glow {
          position: absolute;
          inset: -10px;
          background: var(--primary-color);
          filter: blur(20px);
          opacity: 0.2;
          border-radius: 40px;
          z-index: 1;
          animation: pulse-glow 4s infinite alternate;
        }

        @keyframes pulse-glow {
          from { opacity: 0.1; transform: scale(0.95); }
          to { opacity: 0.3; transform: scale(1.05); }
        }

        .profile-meta-info {
          flex: 1;
        }

        .profile-name-display {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 0.5rem 0;
        }

        .profile-email-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 1rem;
          background: rgba(99, 102, 241, 0.1);
          color: var(--primary-color);
          border-radius: 100px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .edit-action-btn {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.75rem 1.5rem;
          background: var(--surface-color);
          border: 1px solid var(--border-color);
          border-radius: 14px;
          color: var(--text-primary);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .edit-action-btn:hover {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(99, 102, 241, 0.2);
        }

        .profile-divider {
          height: 1px;
          background: linear-gradient(to right, var(--border-color), transparent);
          margin-bottom: 2.5rem;
        }

        .profile-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .form-group-modern {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .form-group-modern.full-width {
          grid-column: 1 / -1;
        }

        .input-label-premium {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-tertiary);
        }

        .profile-form-footer {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border-color);
        }

        .btn-modern {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1.75rem;
          border-radius: 14px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .btn-modern.primary {
          background: var(--primary-color);
          color: white;
          border: none;
          box-shadow: 0 8px 16px rgba(99, 102, 241, 0.2);
        }

        .btn-modern.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(99, 102, 241, 0.3);
          background: #4f46e5;
        }

        .btn-modern.secondary {
          background: transparent;
          color: var(--text-secondary);
          border: 1px solid var(--border-color);
        }

        .btn-modern.secondary:hover {
          background: rgba(0, 0, 0, 0.02);
          color: var(--text-primary);
          border-color: var(--text-primary);
        }

        .animate-in {
          animation: slide-up 0.4s ease-out forwards;
        }

        @keyframes slide-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .profile-alert {
          padding: 1rem 1.5rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          font-weight: 500;
          font-size: 0.95rem;
        }

        .profile-alert.error {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .profile-alert.success {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.2);
        }

        .spinner-small {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .profile-container-wrapper {
            padding: 80px 1rem 2rem;
          }
          .profile-hero-section {
            flex-direction: column;
            text-align: center;
            gap: 1.5rem;
          }
          .profile-glass-card {
            padding: 2rem;
          }
          .profile-form-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .edit-action-btn {
            width: 100%;
            justify-content: center;
          }
          .profile-form-footer {
            flex-direction: column;
          }
          .btn-modern {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
