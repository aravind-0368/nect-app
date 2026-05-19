import React from 'react';
import { Link } from 'react-router-dom';
import TaskModule from '../components/TaskModule';
import './TasksPage.css';

function TasksPage({ tasks, onAddTask, onToggleTask, onDeleteTask }) {
  return (
    <div className="tasks-page">
      <div className="page-header">
        <div className="header-content">
          <h1>Tasks</h1>
          <p className="page-subtitle">Manage Your Tasks</p>
        </div>
        <Link to="/" className="back-to-dashboard">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="page-content">
        <TaskModule 
          tasks={tasks}
          onAddTask={onAddTask}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
        />
      </div>
    </div>
  );
}

export default TasksPage;
