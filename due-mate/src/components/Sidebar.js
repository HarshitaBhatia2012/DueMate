import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, CheckSquare, CalendarDays, Settings, Home, BarChart2 } from 'lucide-react';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const navItems = [
    { name: 'Homepage', path: '/', icon: Home, exact: true },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Calendar', path: '/calendar', icon: CalendarDays },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Add Assignment', path: '/add-assignment', icon: PlusCircle },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-menu">
        <p className="sidebar-title">Menu</p>
        <ul className="sidebar-list">
          {navItems.map((item) => (
            <li key={item.name} className="sidebar-item">
              <NavLink 
                to={item.path} 
                end={item.exact}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <item.icon size={18} className="sidebar-icon" />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-footer">
        <ul className="sidebar-list">
          <li className="sidebar-item">
            <NavLink to="/settings" className="sidebar-link">
              <Settings size={18} className="sidebar-icon" />
              <span>Settings</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
