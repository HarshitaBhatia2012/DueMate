import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays,
  parseISO,
  isPast
} from 'date-fns';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAssignments } from '../context/AssignmentContext';
import '../styles/Dashboard.css'; // Inheriting layout rules
import '../styles/Calendar.css';

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { assignments } = useAssignments();

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // Determine rendering boundaries for the calendar grid
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const renderHeader = () => {
    return (
      <div className="calendar-header">
        <button onClick={prevMonth} className="btn-icon">
          <ChevronLeft size={24} />
        </button>
        <h2 className="calendar-title">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <button onClick={nextMonth} className="btn-icon">
          <ChevronRight size={24} />
        </button>
      </div>
    );
  };

  const renderDaysOfWeek = () => {
    const days = [];
    let date = startOfWeek(currentDate);
    for (let i = 0; i < 7; i++) {
        days.push(
            <div className="day-name" key={i}>
                {format(date, 'EEE')}
            </div>
        );
        date = addDays(date, 1);
    }
    return <div className="days-row">{days}</div>;
  };

  const renderCells = () => {
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const overlayDay = day; // capture closure instance
        
        // Find assignments mapped to this exact day
        const dayAssignments = assignments.filter(assignment => {
            const assignmentDate = parseISO(assignment.due_date);
            return isSameDay(assignmentDate, overlayDay);
        });

        days.push(
          <div
            className={`calendar-cell ${
              !isSameMonth(day, monthStart)
                ? 'disabled'
                : isSameDay(day, new Date()) ? 'today' : ''
            }`}
            key={day}
          >
            <span className="date-number">{formattedDate}</span>
            <div className="cell-content">
                {dayAssignments.map(assign => {
                    let statusClass = assign.status;
                    if (statusClass === 'pending' && isPast(overlayDay) && !isSameDay(overlayDay, new Date())) {
                        statusClass = 'overdue';
                    }
                    return (
                      <div 
                          key={assign.id} 
                          className={`calendar-event ${statusClass}`}
                          title={assign.title}
                      >
                          {assign.title}
                      </div>
                    );
                })}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="calendar-row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="calendar-body">{rows}</div>;
  };

  return (
    <div className="page-container dashboard-layout">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <main className="main-content dashboard-main">
            <div className="dashboard-header">
                <div>
                <h1 className="dashboard-title">Calendar</h1>
                <p className="dashboard-subtitle">Visualize your deadlines across the month.</p>
                </div>
            </div>
            
            <div className="calendar-widget card">
                {renderHeader()}
                {renderDaysOfWeek()}
                {renderCells()}
            </div>
        </main>
      </div>
    </div>
  );
};

export default CalendarView;
