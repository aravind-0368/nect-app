import React from 'react';
import ExerciseChart from './ExerciseChart';
import './Dashboard.css';

function Dashboard({ tasks, exerciseHistory, caloriesToday, proteinToday, bmrTarget, proteinTarget }) {
  const completedTasks = tasks.filter(task => task.status === 'Completed');
  const totalPoints = completedTasks.reduce((sum, task) => sum + parseInt(task.points || 0), 0);
  const completedCount = completedTasks.length;
  const totalCount = tasks.length;
  const notCompletedCount = totalCount - completedCount;

  const calorieDiff = caloriesToday - bmrTarget;
  const calorieStatus = calorieDiff >= 0 ? 'Surplus' : 'Deficit';

  const proteinDiff = proteinToday - proteinTarget;
  const proteinStatus = proteinDiff >= 0 ? 'Above' : 'Below';

  const percentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <div className="dashboard-content">
        <div className="progress-circle-container">
          <div className="progress-circle" style={{
            background: `conic-gradient(#4CAF50 0deg ${(percentage / 100) * 360}deg, #e0e0e0 ${(percentage / 100) * 360}deg 360deg)`
          }}>
            <div className="progress-circle-inner">
              <div className="points-badge">{totalPoints}</div>
              <p className="points-label">Points</p>
            </div>
          </div>
        </div>

        <div className="summary-section">
          <h3>Summary</h3>
          <div className="summary-stats">
            <div className="stat-item completed">
              <span className="stat-label">Completed</span>
              <span className="stat-value">{completedCount}</span>
            </div>
            <div className="stat-item not-completed">
              <span className="stat-label">Not Completed</span>
              <span className="stat-value">{notCompletedCount}</span>
            </div>
            <div className="stat-item total">
              <span className="stat-label">Total Tasks</span>
              <span className="stat-value">{totalCount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="nutrition-cards">
        <div className="nutrition-card calorie-card">
          <span className="nutrition-label">Calories today</span>
          <strong className="nutrition-value">{caloriesToday.toFixed(1)} kcal</strong>
          <div className="nutrition-meta">
            <span>{calorieStatus}</span>
            <span>{Math.abs(calorieDiff).toFixed(1)} kcal</span>
          </div>
          <p className="nutrition-target">BMR target: {bmrTarget} kcal</p>
        </div>
        <div className="nutrition-card protein-card">
          <span className="nutrition-label">Protein today</span>
          <strong className="nutrition-value">{proteinToday.toFixed(1)} g</strong>
          <div className="nutrition-meta">
            <span>{proteinStatus}</span>
            <span>{Math.abs(proteinDiff).toFixed(1)} g</span>
          </div>
          <p className="nutrition-target">Protein target: {proteinTarget} g</p>
        </div>
      </div>

      <div className="dashboard-chart">
        <ExerciseChart history={exerciseHistory} title="Exercise Trend" viewType="daily" unitLabel="sessions" />
      </div>
    </div>
  );
}

export default Dashboard;
