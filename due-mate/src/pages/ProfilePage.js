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
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <h1 className="page-title">My Profile</h1>
        </div>

        <div className="profile-card card">
          <div className="profile-header">
            <div className="profile-avatar-large">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info-summary">
              <h2>{user.username}</h2>
              <p>{user.email}</p>
            </div>
            {!isEditing && (
              <button className="btn btn-outline edit-profile-toggle" onClick={() => setIsEditing(true)}>
                <Edit2 size={16} />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          <form className="profile-form" onSubmit={handleUpdate}>
            {error && <div className="form-error-banner">{error}</div>}
            {success && <div className="form-success-banner">{success}</div>}

            <div className="form-section">
              <h3>Account Details</h3>
              <FormInput
                id="username"
                label="Username"
                value={formData.username}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
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
              <div className="form-section">
                <h3>Change Password (leave blank to keep current)</h3>
                <FormInput
                  id="password"
                  type="password"
                  label="New Password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            )}

            {isEditing && (
              <div className="profile-actions">
                <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>
                  <X size={16} />
                  <span>Cancel</span>
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  <Save size={16} />
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
      
      <style>{`
        .dashboard-container {
          padding-top: 80px; /* Space for the sticky navbar */
          min-height: 100vh;
          background-color: var(--bg-color);
        }
        .profile-card {
          max-width: 600px;
          margin: 0 auto;
          padding: 2rem;
          background-color: var(--surface-color);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
          box-shadow: var(--shadow-md);
        }
        .profile-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2.5rem;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 1.5rem;
        }
        .profile-avatar-large {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary-color) 0%, #4338ca 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 700;
        }
        .profile-info-summary h2 {
          font-size: 1.5rem;
          margin-bottom: 0.25rem;
          color: var(--text-primary);
        }
        .profile-info-summary p {
          color: var(--text-secondary);
        }
        .edit-profile-toggle {
          margin-left: auto;
        }
        .form-section {
          margin-bottom: 2rem;
        }
        .form-section h3 {
          font-size: 0.875rem;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 1rem;
        }
        .profile-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid var(--border-color);
        }
        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-primary);
          background-color: var(--surface-color);
          border: 1px solid var(--border-color);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
          margin-bottom: 1.5rem;
          font-weight: 600;
          transition: all 0.2s;
          cursor: pointer;
        }
        .back-btn:hover {
          background-color: var(--bg-color);
          border-color: var(--primary-color);
          color: var(--primary-color);
        }
        .page-header {
          max-width: 600px;
          margin: 0 auto 1rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .page-title {
          font-size: 2rem;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;
