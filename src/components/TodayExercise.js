import React, { useState, useEffect } from 'react';
import './TodayExercise.css';

function TodayExercise({ templatePlan, onCompleteExercise, exerciseCompletions, onUpdateCompletions }) {
  const [todayExercises, setTodayExercises] = useState([]);
  const [completedExercises, setCompletedExercises] = useState({});
  const [allCompleted, setAllCompleted] = useState(false);

  // Get today's day of week
  const getTodayDay = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
  };

  // Load today's exercises from template
  useEffect(() => {
    const today = getTodayDay();
    const planForToday = templatePlan.find(p => p.day === today);
    
    if (planForToday && !planForToday.restDay) {
      setTodayExercises(planForToday.exercises || []);
    } else {
      setTodayExercises([]);
    }

    // Load completion status from exerciseCompletions
    const today_key = new Date().toISOString().split('T')[0];
    const completions = exerciseCompletions[today_key] || {};
    setCompletedExercises(completions);
  }, [templatePlan, exerciseCompletions]);

  // Check if all exercises are completed
  useEffect(() => {
    if (todayExercises.length === 0) {
      setAllCompleted(false);
      return;
    }
    const allDone = todayExercises.every(ex => completedExercises[ex.id]);
    setAllCompleted(allDone);
    
    if (allDone && todayExercises.length > 0) {
      onCompleteExercise();
    }
  }, [completedExercises, todayExercises, onCompleteExercise]);

  const toggleExerciseComplete = (exerciseId) => {
    const today_key = new Date().toISOString().split('T')[0];
    const updatedCompletions = {
      ...completedExercises,
      [exerciseId]: !completedExercises[exerciseId]
    };
    setCompletedExercises(updatedCompletions);
    
    // Update parent state
    onUpdateCompletions(today_key, updatedCompletions);
  };

  const todayDay = getTodayDay();

  if (todayExercises.length === 0) {
    return (
      <div className="today-exercise">
        <h2>Today's Exercises</h2>
        <div className="empty-state">
          <p>🛌 Rest day or no exercises planned for {todayDay}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="today-exercise">
      <div className="today-header">
        <h2>Today's Exercises</h2>
        <span className="today-day">{todayDay}</span>
      </div>

      <div className={`exercises-container ${allCompleted ? 'all-completed' : ''}`}>
        {todayExercises.map(exercise => (
          <div key={exercise.id} className={`exercise-card ${completedExercises[exercise.id] ? 'completed' : ''}`}>
            <label className="exercise-checkbox">
              <input
                type="checkbox"
                checked={completedExercises[exercise.id] || false}
                onChange={() => toggleExerciseComplete(exercise.id)}
              />
              <span className="checkmark"></span>
            </label>
            <div className="exercise-details-card">
              <h3>{exercise.name}</h3>
              <div className="exercise-stats">
                <span className="stat">
                  <strong>{exercise.sets}</strong> Sets
                </span>
                <span className="stat">
                  <strong>{exercise.reps}</strong> Reps
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {allCompleted && todayExercises.length > 0 && (
        <div className="completion-badge">
          <p>🎉 All exercises completed! +30 points earned</p>
        </div>
      )}

      <div className="progress-info">
        <p>
          Completed: {Object.values(completedExercises).filter(Boolean).length} / {todayExercises.length}
        </p>
      </div>
    </div>
  );
}

export default TodayExercise;
