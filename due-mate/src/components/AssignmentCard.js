import React from 'react';
import { Calendar, Clock, BookOpen, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';
import { format, isPast, isToday, isTomorrow, formatDistanceToNow } from 'date-fns';
import { useAssignments } from '../context/AssignmentContext';
import '../styles/AssignmentCard.css';

const AssignmentCard = ({ assignment, onStatusToggle }) => {
  const { deleteAssignment } = useAssignments();
  const { id, title, description, subject, due_date, status } = assignment;
  
  const dateObj = new Date(due_date);
  const normalizedStatus = status.toLowerCase();
  const isPending = normalizedStatus === 'pending';
  const isOverdue = isPending && isPast(dateObj) && !isToday(dateObj);
  
  // Format the due date nicely
  const getDateText = () => {
    if (isToday(dateObj)) return 'Today';
    if (isTomorrow(dateObj)) return 'Tomorrow';
    if (isPast(dateObj) && !isToday(dateObj)) return `${formatDistanceToNow(dateObj)} ago`;
    return format(dateObj, 'MMM d, yyyy');
  };

  return (
    <div className={`assignment-card card ${normalizedStatus}`}>
      <div className="card-header">
        <span className="subject-badge">
          <BookOpen size={14} />
          {subject}
        </span>
        <div className="card-header-actions">
          <div className={`status-badge ${normalizedStatus}`}>
            {isPending ? <Clock size={14} /> : <CheckCircle2 size={14} />}
            <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
          </div>
          <button 
            className="delete-card-btn" 
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this assignment?')) {
                deleteAssignment(id);
              }
            }}
            title="Delete Assignment"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        {description && <p className="card-description">{description}</p>}
      </div>
      
      <div className="card-footer">
        <div className={`due-date ${isOverdue ? 'overdue' : ''}`}>
          {isOverdue ? <AlertCircle size={14} /> : <Calendar size={14} />}
          <span>{isOverdue ? 'Overdue - ' : 'Due '}{getDateText()}</span>
        </div>
        
        <button 
          className={`btn btn-sm ${isPending ? 'btn-outline' : 'btn-ghost'}`}
          onClick={() => onStatusToggle(id)}
        >
          {isPending ? 'Mark Complete' : 'Undo'}
        </button>
      </div>
    </div>
  );
};

export default AssignmentCard;
