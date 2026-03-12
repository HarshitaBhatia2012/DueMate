import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Clock, BookOpen, Calendar, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAssignments } from '../context/AssignmentContext';
import { format, isPast, isToday, isTomorrow, formatDistanceToNow } from 'date-fns';
import '../styles/Dashboard.css'; // Reuse basic dashboard layouts
import '../styles/Tasks.css';

const MyTasks = () => {
  const { assignments, toggleStatus } = useAssignments();
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  // Filter only pending assignments and sort by deadline
  const pendingAssignments = assignments
    .filter(a => a.status.toLowerCase() === 'pending')
    .sort((a, b) => {
      const dateA = new Date(a.due_date);
      const dateB = new Date(b.due_date);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

  return (
    <div className="page-container dashboard-layout">
      <Navbar />
      
      <div className="dashboard-content">
        <Sidebar />
        
        <main className="main-content dashboard-main">
          <div className="dashboard-header">
            <div>
              <h1 className="dashboard-title">My Tasks</h1>
              <p className="dashboard-subtitle">A focused view of everything you need to do.</p>
            </div>
            
            <div className="tasks-header-actions">
              <div className="sort-control">
                <label htmlFor="sortOrder">Sort by Due Date:</label>
                <select 
                  id="sortOrder" 
                  value={sortOrder} 
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="sort-select"
                >
                  <option value="asc">Earliest First</option>
                  <option value="desc">Latest First</option>
                </select>
              </div>
              
              <Link to="/add-assignment" className="btn btn-primary">
                <PlusCircle size={18} />
                Add Assignment
              </Link>
            </div>
          </div>
          
          <div className="tasks-container">
            {pendingAssignments.length > 0 ? (
              <div className="tasks-list">
                {pendingAssignments.map(assignment => {
                  const dateObj = new Date(assignment.due_date);
                  const isOverdue = isPast(dateObj) && !isToday(dateObj);
                  
                  const getDateText = () => {
                    if (isToday(dateObj)) return 'Today';
                    if (isTomorrow(dateObj)) return 'Tomorrow';
                    if (isPast(dateObj) && !isToday(dateObj)) return `${formatDistanceToNow(dateObj)} ago`;
                    return format(dateObj, 'MMM d, yyyy');
                  };

                  return (
                    <div key={assignment.id} className="task-row card">
                      <button 
                        className="task-checkbox-btn"
                        onClick={() => toggleStatus(assignment.id)}
                        aria-label="Mark complete"
                      >
                        <div className="task-checkbox-circle"></div>
                      </button>
                      
                      <div className="task-details">
                        <div className="task-main">
                          <h3 className="task-title">{assignment.title}</h3>
                          {assignment.description && (
                            <p className="task-desc">{assignment.description}</p>
                          )}
                        </div>
                        
                        <div className="task-meta">
                          <span className="task-badge">
                            <BookOpen size={12} /> {assignment.subject}
                          </span>
                          <span className={`task-date ${isOverdue ? 'overdue' : ''}`}>
                            {isOverdue ? <AlertCircle size={12} /> : <Calendar size={12} />}
                            {getDateText()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state card">
                <div className="empty-icon">✅</div>
                <h3>All caught up!</h3>
                <p>You have no pending tasks. Enjoy your free time or add new assignments.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyTasks;
