import React, { useState } from 'react';
import './TaskModule.css';

function TaskModule({ tasks, onAddTask, onToggleTask, onDeleteTask }) {
  const [showForm, setShowForm] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskPoints, setTaskPoints] = useState('');

  const handleAddTask = () => {
    if (taskName.trim() === '' || taskPoints.trim() === '') {
      alert('Please fill in all fields');
      return;
    }

    // Validate that points is a number
    if (isNaN(taskPoints)) {
      alert('Points must be a number');
      return;
    }

    onAddTask({
      name: taskName,
      points: taskPoints,
      status: 'Not Completed'
    });

    // Reset form
    setTaskName('');
    setTaskPoints('');
    setShowForm(false);
  };

  const handleToggleTask = (taskId) => {
    onToggleTask(taskId);
  };

  return (
    <div className="task-module">
      <h2>Tasks</h2>
      
      <button 
        className="add-task-btn"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? '✕ Cancel' : '+ Add Task'}
      </button>

      {showForm && (
        <div className="task-form">
          <div className="form-group">
            <label htmlFor="taskName">Task Name</label>
            <input
              id="taskName"
              type="text"
              placeholder="Enter task name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            />
          </div>

          <div className="form-group">
            <label htmlFor="taskPoints">Points</label>
            <input
              id="taskPoints"
              type="number"
              placeholder="Enter points"
              value={taskPoints}
              onChange={(e) => setTaskPoints(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            />
          </div>

          <div className="form-actions">
            <button className="save-btn" onClick={handleAddTask}>Save Task</button>
            <button className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="task-table-container">
        <table className="task-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Status</th>
              <th>Points</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr className="empty-row">
                <td colSpan="4">No tasks yet. Add one to get started!</td>
              </tr>
            ) : (
              tasks.map(task => (
                <tr key={task.id} className={`task-row ${task.status.toLowerCase().replace(' ', '-')}`}>
                  <td className="task-name">{task.name}</td>
                  <td className="task-status">
                    <button
                      className={`status-btn ${task.status.toLowerCase().replace(' ', '-')}`}
                      onClick={() => handleToggleTask(task.id)}
                    >
                      {task.status}
                    </button>
                  </td>
                  <td className="task-points">{task.points}</td>
                  <td className="task-actions">
                    <button
                      className="delete-btn"
                      onClick={() => onDeleteTask(task.id)}
                      title="Delete task"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TaskModule;
