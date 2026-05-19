import React from 'react';
import Dashboard from '../components/Dashboard';
import './DashboardPage.css';

function DashboardPage({ tasks, exerciseHistory, foodHistory, caloriesToday, proteinToday, bmrTarget, proteinTarget }) {
  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p className="page-subtitle">Today's Summary</p>
      </div>

      <div className="page-content">
        <Dashboard 
          tasks={tasks} 
          exerciseHistory={exerciseHistory} 
          foodHistory={foodHistory} 
          caloriesToday={caloriesToday} 
          proteinToday={proteinToday} 
          bmrTarget={bmrTarget}
          proteinTarget={proteinTarget}
        />
      </div>
    </div>
  );
}

export default DashboardPage;
