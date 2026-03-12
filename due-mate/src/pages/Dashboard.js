import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, Filter } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AssignmentCard from '../components/AssignmentCard';
import { useAssignments } from '../context/AssignmentContext';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { assignments, toggleStatus } = useAssignments();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, completed

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          assignment.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || assignment.status.toLowerCase() === filter;
    
    return matchesSearch && matchesFilter;
  }).sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

  return (
    <div className="page-container dashboard-layout">
      <Navbar />
      
      <div className="dashboard-content">
        <Sidebar />
        
        <main className="main-content dashboard-main">
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">Dashboard</h1>
              <p className="dashboard-subtitle">Here's an overview of your assignments.</p>
            </div>
            
            <Link to="/add-assignment" className="btn btn-primary">
              <PlusCircle size={18} />
              Add Assignment
            </Link>
          </div>
          
          <div className="dashboard-controls">
            <div className="search-bar">
              <Search className="search-icon" size={18} />
              <input 
                type="text" 
                placeholder="Search assignments..." 
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="filter-controls">
              <Filter className="filter-icon" size={18} />
              <select 
                className="filter-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          
          <div className="dashboard-stats">
            <div className="stat-card card">
              <div className="stat-value">{assignments.length}</div>
              <div className="stat-label">Total Assignments</div>
            </div>
            <div className="stat-card card">
              <div className="stat-value text-brand">
                {assignments.filter(a => a.status.toLowerCase() === 'pending').length}
              </div>
              <div className="stat-label">Pending Updates</div>
            </div>
            <div className="stat-card card">
              <div className="stat-value text-success">
                {assignments.filter(a => a.status.toLowerCase() === 'completed').length}
              </div>
              <div className="stat-label">Completed Tasks</div>
            </div>
          </div>
          
          <h2 className="section-title">Your Assignments</h2>
          
          {filteredAssignments.length > 0 ? (
            <div className="assignments-grid">
              {filteredAssignments.map(assignment => (
                <AssignmentCard 
                  key={assignment.id} 
                  assignment={assignment} 
                  onStatusToggle={toggleStatus}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state card">
              <div className="empty-icon">📝</div>
              <h3>No assignments found</h3>
              <p>Try adjusting your search or filters, or create a new assignment.</p>
              <Link to="/add-assignment" className="btn btn-outline mt-4">
                Create Assignment
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
