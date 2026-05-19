import React from 'react';
import { Link } from 'react-router-dom';
import FoodTracker from '../components/FoodTracker';
import './FoodPage.css';

function FoodPage({
  foodDatabase,
  foodLog,
  onAddFoodLog,
  onDeleteFoodLog,
  onAddFoodData
}) {
  return (
    <div className="food-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Food Tracker</h1>
          <p className="page-subtitle">Log meals and track daily calories</p>
        </div>
        <Link to="/" className="back-to-dashboard">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="page-content">
        <FoodTracker
          foodDatabase={foodDatabase}
          foodLog={foodLog}
          onAddFoodLog={onAddFoodLog}
          onDeleteFoodLog={onDeleteFoodLog}
          onAddFoodData={onAddFoodData}
        />
      </div>
    </div>
  );
}

export default FoodPage;
