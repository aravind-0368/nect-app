import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  const location = useLocation();

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <h1 className="brand-title">Nect</h1>
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              <span className="nav-icon">📊</span>
              <span className="nav-text">Dashboard</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/exercises" 
              className={`nav-link ${location.pathname === '/exercises' ? 'active' : ''}`}
            >
              <span className="nav-icon">💪</span>
              <span className="nav-text">Exercises</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/food" 
              className={`nav-link ${location.pathname === '/food' ? 'active' : ''}`}
            >
              <span className="nav-icon">🍎</span>
              <span className="nav-text">Food</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/tasks" 
              className={`nav-link ${location.pathname === '/tasks' ? 'active' : ''}`}
            >
              <span className="nav-icon">✓</span>
              <span className="nav-text">Tasks</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
