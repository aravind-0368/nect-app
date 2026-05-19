import React, { useState } from 'react';
import './TemplatePlanBuilder.css';

function TemplatePlanBuilder({ templatePlan, onSavePlan }) {
  const [currentDay, setCurrentDay] = useState('Monday');
  const [selectedMuscles, setSelectedMuscles] = useState([]);
  const [isRestDay, setIsRestDay] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [exerciseName, setExerciseName] = useState('');
  const [reps, setReps] = useState('');
  const [sets, setSets] = useState('');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const muscles = ['Chest', 'Legs', 'Back', 'Arms', 'Abs'];

  // Load existing plan for selected day
  React.useEffect(() => {
    const existingPlan = templatePlan.find(p => p.day === currentDay);
    if (existingPlan) {
      setSelectedMuscles(existingPlan.muscleGroups || []);
      setIsRestDay(existingPlan.restDay || false);
      setExercises(existingPlan.exercises || []);
    } else {
      setSelectedMuscles([]);
      setIsRestDay(false);
      setExercises([]);
    }
  }, [currentDay, templatePlan]);

  const toggleMuscle = (muscle) => {
    setSelectedMuscles(prev => 
      prev.includes(muscle) 
        ? prev.filter(m => m !== muscle)
        : [...prev, muscle]
    );
  };

  const addExercise = () => {
    if (!exerciseName.trim() || !reps.trim() || !sets.trim()) {
      alert('Please fill in all exercise fields');
      return;
    }
    setExercises([
      ...exercises,
      {
        id: Date.now(),
        name: exerciseName,
        reps: parseInt(reps),
        sets: parseInt(sets)
      }
    ]);
    setExerciseName('');
    setReps('');
    setSets('');
  };

  const removeExercise = (id) => {
    setExercises(exercises.filter(e => e.id !== id));
  };

  const savePlan = () => {
    if (!isRestDay && exercises.length === 0) {
      alert('Please add exercises or mark as Rest Day');
      return;
    }
    onSavePlan({
      day: currentDay,
      muscleGroups: selectedMuscles,
      exercises: exercises,
      restDay: isRestDay
    });
    alert(`Plan saved for ${currentDay}!`);
  };

  return (
    <div className="template-plan-builder">
      <h2>Weekly Exercise Template</h2>

      {/* Day Selection */}
      <div className="days-selector">
        {days.map(day => (
          <button
            key={day}
            className={`day-btn ${currentDay === day ? 'active' : ''}`}
            onClick={() => setCurrentDay(day)}
          >
            {day.slice(0, 3)}
          </button>
        ))}
      </div>

      <div className="plan-content">
        {/* Rest Day Toggle */}
        <div className="rest-day-toggle">
          <label>
            <input
              type="checkbox"
              checked={isRestDay}
              onChange={(e) => setIsRestDay(e.target.checked)}
            />
            <span>Mark as Rest Day</span>
          </label>
        </div>

        {!isRestDay && (
          <>
            {/* Muscle Groups */}
            <div className="muscle-groups-section">
              <h3>Target Muscle Groups</h3>
              <div className="muscle-buttons">
                {muscles.map(muscle => (
                  <button
                    key={muscle}
                    className={`muscle-btn ${selectedMuscles.includes(muscle) ? 'selected' : ''}`}
                    onClick={() => toggleMuscle(muscle)}
                  >
                    {muscle}
                  </button>
                ))}
              </div>
            </div>

            {/* Add Exercises */}
            <div className="add-exercise-section">
              <h3>Add Exercises</h3>
              <div className="exercise-input-group">
                <input
                  type="text"
                  placeholder="Exercise name"
                  value={exerciseName}
                  onChange={(e) => setExerciseName(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Reps"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  min="1"
                />
                <input
                  type="number"
                  placeholder="Sets"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  min="1"
                />
                <button onClick={addExercise} className="add-exercise-btn">
                  Add
                </button>
              </div>

              {/* Exercise List */}
              {exercises.length > 0 && (
                <div className="exercises-list">
                  {exercises.map(exercise => (
                    <div key={exercise.id} className="exercise-item">
                      <div className="exercise-info">
                        <span className="exercise-name">{exercise.name}</span>
                        <span className="exercise-details">
                          {exercise.sets} sets × {exercise.reps} reps
                        </span>
                      </div>
                      <button
                        className="remove-exercise-btn"
                        onClick={() => removeExercise(exercise.id)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {isRestDay && (
          <div className="rest-day-message">
            <p>🛌 Rest and recover</p>
          </div>
        )}

        <button onClick={savePlan} className="save-plan-btn">
          Save {currentDay} Plan
        </button>
      </div>
    </div>
  );
}

export default TemplatePlanBuilder;
