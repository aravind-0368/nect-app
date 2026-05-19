import React from 'react';
import { Link } from 'react-router-dom';
import TodayExercise from '../components/TodayExercise';
import TemplatePlanBuilder from '../components/TemplatePlanBuilder';
import './ExercisePage.css';

function ExercisePage({ 
  templatePlan, 
  onSavePlan, 
  onCompleteExercise,
  exerciseCompletions,
  onUpdateCompletions
}) {
  const [activeTab, setActiveTab] = React.useState('today');

  return (
    <div className="exercise-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Exercises</h1>
          <p className="page-subtitle">Build Your Fitness Plan</p>
        </div>
        <Link to="/" className="back-to-dashboard">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="page-content">
        <div className="tabs">
          <button 
            className={`tab-btn ${activeTab === 'today' ? 'active' : ''}`}
            onClick={() => setActiveTab('today')}
          >
            📅 Today's Exercises
          </button>
          <button 
            className={`tab-btn ${activeTab === 'plan' ? 'active' : ''}`}
            onClick={() => setActiveTab('plan')}
          >
            📋 Weekly Plan
          </button>
        </div>

        {activeTab === 'today' && (
          <TodayExercise 
            templatePlan={templatePlan}
            onCompleteExercise={onCompleteExercise}
            exerciseCompletions={exerciseCompletions}
            onUpdateCompletions={onUpdateCompletions}
          />
        )}

        {activeTab === 'plan' && (
          <TemplatePlanBuilder 
            templatePlan={templatePlan}
            onSavePlan={onSavePlan}
          />
        )}
      </div>
    </div>
  );
}

export default ExercisePage;
