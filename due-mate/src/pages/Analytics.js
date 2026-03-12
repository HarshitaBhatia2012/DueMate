import React from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAssignments } from '../context/AssignmentContext';
import { 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  BarChart3,
  Calendar as CalendarIcon
} from 'lucide-react';
import '../styles/Analytics.css';

const Analytics = () => {
  const { assignments } = useAssignments();
  const [activePeriod, setActivePeriod] = React.useState('7d');

  // Calculate statistics
  const totalTasks = assignments.length;
  const completedTasks = assignments.filter(a => a.status === 'completed').length;
  const pendingTasks = assignments.filter(a => a.status === 'pending').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const overdueTasks = assignments.filter(a => {
    return a.status.toLowerCase() !== 'completed' && new Date(a.due_date) < new Date();
  }).length;

  // Mock data for the productivity chart
  const productivityData = activePeriod === '7d' ? [
    { day: 'Mon', count: 4 },
    { day: 'Tue', count: 7 },
    { day: 'Wed', count: 5 },
    { day: 'Thu', count: 8 },
    { day: 'Fri', count: 3 },
    { day: 'Sat', count: 9 },
    { day: 'Sun', count: 6 },
  ] : [
    { day: 'Week 1', count: 22 },
    { day: 'Week 2', count: 18 },
    { day: 'Week 3', count: 25 },
    { day: 'Week 4', count: 30 },
  ];

  const maxCount = Math.max(...productivityData.map(d => d.count));
  const chartHeight = 160;
  const chartWidth = 500;
  const barWidth = activePeriod === '7d' ? 40 : 80;
  const gap = activePeriod === '7d' ? 30 : 50;

  return (
    <div className="page-container dashboard-layout">
      <Navbar />
      <div className="dashboard-content">
        <Sidebar />
        <main className="main-content dashboard-main analytics-page">
          <header className="page-header">
            <div className="header-text">
              <h1 className="page-title">Performance Analytics</h1>
              <p className="page-subtitle">Track your productivity and deadline trends</p>
            </div>
          </header>

          <div className="stats-grid">
            <div className="stat-card glass-card">
              <div className="stat-header">
                <div className="stat-icon-bg blue">
                  <CheckCircle2 size={24} />
                </div>
                <span className="stat-label">Completion Rate</span>
              </div>
              <div className="stat-value">{completionRate}%</div>
              <div className="stat-footer">
                <TrendingUp size={14} className="trend-up" />
                <span>+12% from last week</span>
              </div>
            </div>

            <div className="stat-card glass-card">
              <div className="stat-header">
                <div className="stat-icon-bg green">
                  <BarChart3 size={24} />
                </div>
                <span className="stat-label">Total Tasks</span>
              </div>
              <div className="stat-value">{totalTasks}</div>
              <div className="stat-footer">
                <span>{completedTasks} completed, {pendingTasks} pending</span>
              </div>
            </div>

            <div className="stat-card glass-card">
              <div className="stat-header">
                <div className="stat-icon-bg orange">
                  <Clock size={24} />
                </div>
                <span className="stat-label">Avg. Efficiency</span>
              </div>
              <div className="stat-value">94%</div>
              <div className="stat-footer">
                <span>Based on completion speed</span>
              </div>
            </div>

            <div className="stat-card glass-card">
              <div className="stat-header">
                <div className="stat-icon-bg red">
                  <AlertCircle size={24} />
                </div>
                <span className="stat-label">Overdue</span>
              </div>
              <div className="stat-value">{overdueTasks}</div>
              <div className="stat-footer red">
                <span>Requires immediate action</span>
              </div>
            </div>
          </div>

          <div className="analytics-main-grid">
            <div className="chart-section glass-card">
              <div className="chart-header">
                <h3>Productivity Trends</h3>
                <div className="chart-tabs">
                  <button 
                    className={`tab ${activePeriod === '7d' ? 'active' : ''}`}
                    onClick={() => setActivePeriod('7d')}
                  >
                    7 Days
                  </button>
                  <button 
                    className={`tab ${activePeriod === '30d' ? 'active' : ''}`}
                    onClick={() => setActivePeriod('30d')}
                  >
                    30 Days
                  </button>
                </div>
              </div>
              <div className="svg-chart-container">
                <svg width="100%" height="220" viewBox={`0 0 ${chartWidth} 220`} preserveAspectRatio="xMidYMid meet">
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4].map((i) => (
                    <line 
                      key={i} 
                      x1="0" 
                      y1={chartHeight - (i * chartHeight / 4) + 20} 
                      x2={chartWidth} 
                      y2={chartHeight - (i * chartHeight / 4) + 20} 
                      stroke="var(--border-color)" 
                      strokeDasharray="4 4"
                    />
                  ))}

                  {/* Bars with gradients */}
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" />
                      <stop offset="100%" stopColor="#60a5fa" />
                    </linearGradient>
                  </defs>

                  {productivityData.map((d, i) => {
                    const h = (d.count / maxCount) * chartHeight;
                    const x = i * (barWidth + gap) + 40;
                    const y = chartHeight - h + 20;
                    return (
                      <g key={d.day} className="chart-bar-group">
                        <rect 
                          x={x} 
                          y={y} 
                          width={barWidth} 
                          height={h} 
                          rx="6" 
                          fill="url(#barGradient)"
                          className="chart-bar"
                        >
                          <animate attributeName="height" from="0" to={h} dur="0.8s" ease="ease-out" />
                          <animate attributeName="y" from={chartHeight + 20} to={y} dur="0.8s" ease="ease-out" />
                        </rect>
                        <text 
                          x={x + barWidth / 2} 
                          y={chartHeight + 45} 
                          textAnchor="middle" 
                          fill="var(--text-secondary)" 
                          fontSize="12"
                          fontWeight="500"
                        >
                          {d.day}
                        </text>
                        <text 
                          x={x + barWidth / 2} 
                          y={y - 10} 
                          textAnchor="middle" 
                          fill="var(--text-primary)" 
                          fontSize="12" 
                          fontWeight="600"
                        >
                          {d.count}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            <div className="side-analytics glass-card">
              <h3>Category Breakdown</h3>
              <div className="progress-list">
                <div className="progress-item">
                  <div className="progress-info">
                    <span>Work</span>
                    <span>12 tasks</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill blue" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div className="progress-item">
                  <div className="progress-info">
                    <span>Personal</span>
                    <span>5 tasks</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill purple" style={{ width: '40%' }}></div>
                  </div>
                </div>
                <div className="progress-item">
                  <div className="progress-info">
                    <span>Education</span>
                    <span>8 tasks</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill green" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>

              <div className="productivity-insight">
                <div className="insight-icon">
                  <TrendingUp size={20} />
                </div>
                <div className="insight-text">
                  <p><strong>Great progress!</strong> You've completed 4 more tasks this week compared to last.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Analytics;
