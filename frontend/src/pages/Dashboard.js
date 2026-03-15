import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h1>Smart Styling Assistant</h1>
        <button onClick={handleLogout} className="btn-secondary">
          Logout
        </button>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>Welcome, {user?.email}! 👋</h2>
          <p>Your personal AI styling assistant is ready to help.</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <h3>📝 Profile Setup</h3>
            <p>Complete your style profile to get personalized recommendations</p>
            <button className="btn-primary">Setup Profile</button>
          </div>

          <div className="dashboard-card">
            <h3>✨ Generate Outfit</h3>
            <p>Get AI-powered outfit suggestions based on your preferences</p>
            <button className="btn-primary">Generate Now</button>
          </div>

          <div className="dashboard-card">
            <h3>💾 Saved Designs</h3>
            <p>View and manage your favorite outfit combinations</p>
            <button className="btn-primary">View Saved</button>
          </div>

          <div className="dashboard-card">
            <h3>🎨 Style Quiz</h3>
            <p>Take our quiz to discover your unique fashion style</p>
            <button className="btn-primary">Start Quiz</button>
          </div>
        </div>

        {user?.profile?.body_type && (
          <div className="profile-summary">
            <h3>Your Profile</h3>
            <p><strong>Body Type:</strong> {user.profile.body_type}</p>
            {user.profile.skin_tone && (
              <p><strong>Skin Tone:</strong> {user.profile.skin_tone}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;