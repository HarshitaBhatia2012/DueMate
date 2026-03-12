import React from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, Calendar, Clock, Star, MoveRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import '../styles/LandingPage.css';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="landing-page">
      <Navbar />
      
      {/* Decorative Background Elements */}
      <div className="bg-glow glow-blue"></div>
      <div className="bg-glow glow-purple"></div>
      
      <main className="landing-main">
        <div className="hero-section">
          <div className="container">
            <div className="hero-content">
              <div className="hero-badge">
                <Star size={14} className="badge-icon text-brand" />
                <span>The new standard for deadline management</span>
              </div>
              
              <h1 className="hero-title">
                Control your time. <br/>
                <span className="text-gradient">Master your deadlines.</span>
              </h1>
              <p className="hero-subtitle">
                DueMate brings clarity to your schedule with a beautifully designed, 
                lightning-fast platform built for students and professionals who demand focus.
              </p>
              
              <div className="hero-cta">
                <Link to={isAuthenticated ? "/dashboard" : "/signup"} className="btn btn-primary btn-xl cta-glow">
                  {isAuthenticated ? "Back to Dashboard" : "Start for free"} <MoveRight size={18} className="arrow" />
                </Link>
                <Link to="/login" className="btn btn-ghost btn-xl">
                  Book a demo
                </Link>
              </div>
              
              <div className="hero-trust">
                <p>Trusted by students at top universities worldwide</p>
                <div className="avatars-group">
                  <div className="avatar-sm" style={{backgroundColor: '#ef4444'}}>A</div>
                  <div className="avatar-sm" style={{backgroundColor: '#eab308'}}>J</div>
                  <div className="avatar-sm" style={{backgroundColor: '#22c55e'}}>M</div>
                  <div className="avatar-sm" style={{backgroundColor: '#8b5cf6'}}>S</div>
                  <div className="avatar-sm" style={{backgroundColor: '#6b7280'}}>+</div>
                </div>
              </div>
            </div>
            
            {/* Stunning Floating Interface Mockup */}
            <div className="hero-showcase">
              <div className="showcase-glass-card main-interface">
                <div className="interface-header">
                  <div className="dots">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                  </div>
                  <div className="mock-title">duemate.app / dashboard</div>
                </div>
                
                <div className="interface-body">
                  <div className="mock-sidebar">
                    <div className="mock-nav-item active"></div>
                    <div className="mock-nav-item"></div>
                    <div className="mock-nav-item"></div>
                  </div>
                  <div className="mock-content">
                    <div className="mock-header-content"></div>
                    <div className="mock-grid">
                      <div className="mock-card">
                        <div className="mock-badge pending"></div>
                        <div className="mock-text-line long"></div>
                        <div className="mock-text-line short"></div>
                      </div>
                      <div className="mock-card complete">
                        <div className="mock-badge success"></div>
                        <div className="mock-text-line medium"></div>
                      </div>
                      <div className="mock-card">
                        <div className="mock-badge warning"></div>
                        <div className="mock-text-line long"></div>
                        <div className="mock-text-line"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Element 1 */}
              <div className="floating-element float-1 glass-panel">
                <div className="float-icon-wrapper blue">
                  <CheckSquare size={20} />
                </div>
                <div className="float-content">
                  <h4>Task Complete</h4>
                  <p>Calculus Midterm</p>
                </div>
              </div>
              
              {/* Floating Element 2 */}
              <div className="floating-element float-2 glass-panel">
                <div className="float-icon-wrapper red">
                  <Clock size={20} />
                </div>
                <div className="float-content">
                  <h4>Overdue</h4>
                  <p>Lab Report</p>
                </div>
              </div>
              
              {/* Floating Element 3 */}
              <div className="floating-element float-3 glass-panel">
                <div className="float-icon-wrapper purple">
                  <Calendar size={20} />
                </div>
                <div className="float-content">
                  <h4>Due Tomorrow</h4>
                  <p>Literature Essay</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <section className="features-section">
          <div className="container">
            <h2 className="section-heading">Designed for extreme productivity.</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon"><CheckSquare /></div>
                <h3>Intuitive Tracking</h3>
                <p>Quickly add assignments with smart categorization and status toggling.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon"><Clock /></div>
                <h3>Smart Deadlines</h3>
                <p>Automatic due date calculations and overdue alerts keep you on track.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon"><Star /></div>
                <h3>Beautiful UI</h3>
                <p>A clutter-free, minimalist interface inspired by the best SaaS tools.</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="landing-footer">
          <div className="container">
            <div className="footer-grid">
              <div className="footer-brand">
                <div className="navbar-logo">
                  <CheckSquare className="logo-icon" size={24} />
                  <span className="logo-text">DueMate</span>
                </div>
                <p className="footer-tagline">
                  The modern standard for students and professionals to master their deadlines.
                </p>
                <div className="social-links">
                  <span className="social-icon">𝕏</span>
                  <span className="social-icon">GitHub</span>
                  <span className="social-icon">LinkedIn</span>
                </div>
              </div>
              
              <div className="footer-links-group">
                <h4>Product</h4>
                <ul>
                  <li><Link to="/">Features</Link></li>
                  <li><Link to="/">Pricing</Link></li>
                  <li><Link to="/">Changelog</Link></li>
                  <li><Link to="/">Support</Link></li>
                </ul>
              </div>
              
              <div className="footer-links-group">
                <h4>Resources</h4>
                <ul>
                  <li><Link to="/">Documentation</Link></li>
                  <li><Link to="/">Blog</Link></li>
                  <li><Link to="/">Community</Link></li>
                  <li><Link to="/">Contact</Link></li>
                </ul>
              </div>
              
              <div className="footer-links-group">
                <h4>Legal</h4>
                <ul>
                  <li><Link to="/">Privacy Policy</Link></li>
                  <li><Link to="/">Terms of Service</Link></li>
                  <li><Link to="/">Cookie Policy</Link></li>
                </ul>
              </div>
            </div>
            
            <div className="footer-bottom">
              <p>&copy; {new Date().getFullYear()} DueMate Inc. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;
