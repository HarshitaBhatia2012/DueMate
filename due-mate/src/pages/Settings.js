import React from 'react';
import { Settings as SettingsIcon, Bell, Moon, Sun, User, Shield, HelpCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import '../styles/Analytics.css'; // Reusing some analytics/dashboard layout styles

const Settings = () => {
  const { theme, toggleTheme } = useTheme();

  const settingsSections = [
    {
      title: 'Account Settings',
      icon: <User size={20} />,
      description: 'Manage your profile information and account security.',
      link: '/profile',
      linkText: 'Go to Profile'
    },
    {
      title: 'Display & Appearance',
      icon: theme === 'light' ? <Moon size={20} /> : <Sun size={20} />,
      description: `Currently using ${theme} mode. Toggle to switch appearance.`,
      action: toggleTheme,
      actionText: `Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`
    },
    {
      title: 'Notifications',
      icon: <Bell size={20} />,
      description: 'Choose which alerts and reminders you want to receive.',
      disabled: true,
      linkText: 'Coming Soon'
    },
    {
      title: 'Security',
      icon: <Shield size={20} />,
      description: 'Manage your passwords and two-factor authentication.',
      link: '/profile',
      linkText: 'Manage Security'
    }
  ];

  return (
    <div className="page-container dashboard-layout">
      <Navbar />
      
      <div className="dashboard-content">
        <Sidebar />
        
        <main className="main-content">
          <div className="content-header">
            <div>
              <h1 className="content-title">Settings</h1>
              <p className="content-subtitle">Customize your DueMate experience</p>
            </div>
          </div>

          <div className="settings-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
            gap: '1.5rem',
            marginTop: '2rem'
          }}>
            {settingsSections.map((section, index) => (
              <div key={index} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', gap: '1rem' }}>
                  <div className="icon-container" style={{ 
                    padding: '0.75rem', 
                    borderRadius: '12px', 
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--primary-color)'
                  }}>
                    {section.icon}
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{section.title}</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  {section.description}
                </p>
                {section.action ? (
                  <button onClick={section.action} className="btn btn-outline" style={{ width: '100%' }}>
                    {section.actionText}
                  </button>
                ) : (
                  <Link to={section.disabled ? '#' : section.link} className={`btn ${section.disabled ? 'btn-outline disabled' : 'btn-primary'}`} style={{ width: '100%', textAlign: 'center' }}>
                    {section.linkText}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="card" style={{ marginTop: '2rem', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <HelpCircle size={24} className="text-primary" />
              <div>
                <h4 style={{ margin: 0 }}>Need help?</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Check our documentation or contact support.</p>
              </div>
            </div>
            <button className="btn btn-outline">Go to Help Center</button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
