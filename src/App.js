import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import ExercisePage from './pages/ExercisePage';
import FoodPage from './pages/FoodPage';

const defaultFoodItems = [
  { name: 'Apple', calories_per_100g: 52, protein_per_100g: 0.3, carbs_per_100g: 14, fat_per_100g: 0.2 },
  { name: 'Rice (cooked)', calories_per_100g: 130, protein_per_100g: 2.7, carbs_per_100g: 28, fat_per_100g: 0.3 },
  { name: 'Chicken Breast', calories_per_100g: 165, protein_per_100g: 31, carbs_per_100g: 0, fat_per_100g: 3.6 },
  { name: 'Yogurt (plain)', calories_per_100g: 59, protein_per_100g: 10, carbs_per_100g: 3.6, fat_per_100g: 0.4 },
  { name: 'Butter', calories_per_100g: 717, protein_per_100g: 0.9, carbs_per_100g: 0.1, fat_per_100g: 81 },
  { name: 'Paneer', calories_per_100g: 265, protein_per_100g: 18, carbs_per_100g: 6, fat_per_100g: 20 }
];

function App() {
  const [tasks, setTasks] = useState([]);
  const [templatePlan, setTemplatePlan] = useState([]);
  const [exerciseCompletions, setExerciseCompletions] = useState({});
  const [exerciseHistory, setExerciseHistory] = useState({});
  const [foodLog, setFoodLog] = useState([]);
  const [foodDatabase, setFoodDatabase] = useState(defaultFoodItems);
  const [backendError, setBackendError] = useState(null);
  const bmrTarget = 2000;
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, foodsRes, foodLogRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/tasks`),
          fetch(`${API_BASE_URL}/api/foods`),
          fetch(`${API_BASE_URL}/api/food-log`)
        ]);

        if (!tasksRes.ok || !foodsRes.ok || !foodLogRes.ok) {
          throw new Error('Could not load saved data from backend');
        }

        const [tasksData, foodsData, foodLogData] = await Promise.all([
          tasksRes.json(),
          foodsRes.json(),
          foodLogRes.json()
        ]);

        setTasks(tasksData.map(task => ({
          ...task,
          date: task.date || (task.createdAt ? new Date(Number(task.createdAt)).toISOString().split('T')[0] : undefined)
        })));

        if (foodsData.length) {
          setFoodDatabase(foodsData);
        }

        setFoodLog(foodLogData.map(entry => ({
          ...entry,
          quantity_g: Number(entry.quantity_g),
          calories: Number(entry.calories),
          protein: Number(entry.protein),
          carbs: Number(entry.carbs),
          fat: Number(entry.fat)
        })));
      } catch (error) {
        console.error('Error loading data:', error);
        setBackendError('Unable to load saved data. Make sure the backend server is running.');
      }
    };

    fetchData();
  }, []);

  const todayKey = new Date().toISOString().split('T')[0];

  const foodHistory = useMemo(() => {
    return foodLog.reduce((acc, entry) => {
      acc[entry.date] = (acc[entry.date] || 0) + Number(entry.calories);
      return acc;
    }, {});
  }, [foodLog]);

  const caloriesToday = foodHistory[todayKey] || 0;

  const proteinToday = useMemo(() => {
    return foodLog.reduce((sum, entry) => {
      return entry.date === todayKey ? sum + Number(entry.protein) : sum;
    }, 0);
  }, [foodLog, todayKey]);

  const handleAddTask = async (newTask) => {
    try {
      const taskWithTimestamp = { ...newTask, createdAt: Date.now(), date: todayKey };
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskWithTimestamp)
      });

      if (!response.ok) {
        throw new Error('Failed to save task');
      }

      const savedTask = await response.json();
      setTasks(prevTasks => [savedTask, ...prevTasks]);
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Could not save the task. Please make sure the backend is running.');
    }
  };

  const handleToggleTask = async (taskId) => {
    const taskToUpdate = tasks.find(task => Number(task.id) === Number(taskId));
    if (!taskToUpdate) return;

    try {
      const updatedStatus = taskToUpdate.status === 'Completed' ? 'Not Completed' : 'Completed';
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: updatedStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      setTasks(tasks.map(task => (Number(task.id) === Number(taskId) ? { ...task, status: updatedStatus } : task)));
    } catch (error) {
      console.error('Error toggling task:', error);
      alert('Could not update the task status. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      setTasks(prevTasks => prevTasks.filter(task => Number(task.id) !== Number(taskId)));
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Could not delete the task. Please try again.');
    }
  };

  const handleAddFoodLog = async (entry) => {
    try {
      const logEntry = { ...entry, createdAt: Date.now() };
      const response = await fetch(`${API_BASE_URL}/api/food-log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(logEntry)
      });

      if (!response.ok) {
        throw new Error('Failed to save food log entry');
      }

      const savedEntry = await response.json();
      setFoodLog(prevFoodLog => [...prevFoodLog, savedEntry]);
    } catch (error) {
      console.error('Error adding food log entry:', error);
      alert('Could not save the food log entry. Please make sure the backend is running.');
    }
  };

  const handleDeleteFoodLog = async (entryId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/food-log/${entryId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete food log entry');
      }
      setFoodLog(prevFoodLog => prevFoodLog.filter(entry => Number(entry.id) !== Number(entryId)));
    } catch (error) {
      console.error('Error deleting food log entry:', error);
      alert('Could not delete the food log entry. Please try again.');
    }
  };

  const handleAddFoodData = async (foodItem) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/foods`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(foodItem)
      });

      if (!response.ok) {
        throw new Error('Failed to save food item');
      }

      const savedFood = await response.json();
      setFoodDatabase(prevFoodDatabase => [...prevFoodDatabase, savedFood]);
    } catch (error) {
      console.error('Error adding custom food:', error);
      alert('Could not save the food item. Please make sure the backend is running.');
    }
  };

  const handleSavePlan = (planData) => {
    const updatedPlan = templatePlan.filter(p => p.day !== planData.day);
    setTemplatePlan([...updatedPlan, planData]);
  };

  const handleUpdateCompletions = (dateKey, completions) => {
    setExerciseCompletions(prev => ({
      ...prev,
      [dateKey]: completions
    }));
  };

  const handleCompleteExercise = () => {
    const today = new Date().toISOString().split('T')[0];
    if (!exerciseHistory[today]) {
      setExerciseHistory(prev => ({
        ...prev,
        [today]: 1
      }));
    }
  };

  return (
    <Router>
      <div className="App">
        <Navigation />

        <main className="App-main">
          {backendError && (
            <div className="backend-error" style={{ padding: '16px', backgroundColor: '#fee', color: '#a00', textAlign: 'center' }}>
              {backendError}
            </div>
          )}
          <Routes>
            <Route
              path="/"
              element={<DashboardPage tasks={tasks} exerciseHistory={exerciseHistory} foodHistory={foodHistory} caloriesToday={caloriesToday} proteinToday={proteinToday} bmrTarget={bmrTarget} proteinTarget={75} />}
            />
            <Route
              path="/exercises"
              element={
                <ExercisePage
                  templatePlan={templatePlan}
                  onSavePlan={handleSavePlan}
                  onCompleteExercise={handleCompleteExercise}
                  exerciseCompletions={exerciseCompletions}
                  onUpdateCompletions={handleUpdateCompletions}
                />
              }
            />
            <Route
              path="/food"
              element={
                <FoodPage
                  foodDatabase={foodDatabase}
                  foodLog={foodLog}
                  onAddFoodLog={handleAddFoodLog}
                  onDeleteFoodLog={handleDeleteFoodLog}
                  onAddFoodData={handleAddFoodData}
                />
              }
            />
            <Route
              path="/tasks"
              element={
                <TasksPage
                  tasks={tasks}
                  onAddTask={handleAddTask}
                  onToggleTask={handleToggleTask}
                  onDeleteTask={handleDeleteTask}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
