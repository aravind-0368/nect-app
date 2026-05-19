import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import ExercisePage from './pages/ExercisePage';
import FoodPage from './pages/FoodPage';
import { database } from './firebase';
import { ref, onValue, get, push, set, update, remove } from 'firebase/database';

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
  const bmrTarget = 2000;

  useEffect(() => {
    const foodDatabaseRef = ref(database, 'foodDatabase');
    const foodLogRef = ref(database, 'foodLog');
    const tasksRef = ref(database, 'tasks');

    const transformSnapshot = (snapshot) => {
      const value = snapshot.val();
      if (!value) return [];
      return Object.entries(value).map(([id, item]) => ({ id, ...item }));
    };

    const removeExpiredTasks = (tasksList) => {
      const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
      tasksList.forEach((task) => {
        const createdAt = task.createdAt ? Number(task.createdAt) : null;
        if (createdAt && createdAt <= thirtyDaysAgo) {
          remove(ref(database, `tasks/${task.id}`)).catch(error => {
            console.error(`Error removing expired task ${task.id}:`, error);
          });
        }
      });
    };

    const ensureDefaultFoodData = async () => {
      const snapshot = await get(foodDatabaseRef);
      if (!snapshot.exists()) {
        await Promise.all(defaultFoodItems.map(item => push(foodDatabaseRef, item)));
      }
    };

    ensureDefaultFoodData().catch(error => console.error('Error initializing default food data:', error));

    const foodDatabaseListener = onValue(foodDatabaseRef, (snapshot) => {
      const items = transformSnapshot(snapshot);
      if (items.length) {
        setFoodDatabase(items);
      } else {
        setFoodDatabase(defaultFoodItems);
      }
    });

    const foodLogListener = onValue(foodLogRef, (snapshot) => {
      setFoodLog(transformSnapshot(snapshot));
    });

    const tasksListener = onValue(tasksRef, (snapshot) => {
      const items = transformSnapshot(snapshot);
      const nonExpiredItems = items.filter((task) => {
        const createdAt = task.createdAt ? Number(task.createdAt) : null;
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        return !createdAt || createdAt > thirtyDaysAgo;
      });
      setTasks(nonExpiredItems);
      removeExpiredTasks(items);
    });

    return () => {
      foodDatabaseListener();
      foodLogListener();
      tasksListener();
    };
  }, []);

  const todayKey = new Date().toISOString().split('T')[0];

  const foodHistory = useMemo(() => {
    return foodLog.reduce((acc, entry) => {
      acc[entry.date] = (acc[entry.date] || 0) + entry.calories;
      return acc;
    }, {});
  }, [foodLog]);

  const caloriesToday = foodHistory[todayKey] || 0;

  const proteinToday = useMemo(() => {
    return foodLog.reduce((sum, entry) => {
      return entry.date === todayKey ? sum + entry.protein : sum;
    }, 0);
  }, [foodLog, todayKey]);

  const proteinTarget = 75;

  // Task handlers
  const handleAddTask = async (newTask) => {
    const taskWithTimestamp = { ...newTask, createdAt: Date.now() };
    const newTaskRef = push(ref(database, 'tasks'));
    await set(newTaskRef, taskWithTimestamp);
    setTasks(prevTasks => [...prevTasks, { id: newTaskRef.key, ...taskWithTimestamp }]);
  };

  const handleToggleTask = async (taskId) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (!taskToUpdate) return;

    const updatedTask = {
      ...taskToUpdate,
      status: taskToUpdate.status === 'Completed' ? 'Not Completed' : 'Completed'
    };
    await update(ref(database, `tasks/${taskId}`), { status: updatedTask.status });
    setTasks(tasks.map(task => (task.id === taskId ? updatedTask : task)));
  };

  const handleDeleteTask = async (taskId) => {
    await remove(ref(database, `tasks/${taskId}`));
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  // Exercise handlers
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

  const handleAddFoodLog = async (entry) => {
    const newLogRef = push(ref(database, 'foodLog'));
    await set(newLogRef, entry);
    setFoodLog(prevFoodLog => [...prevFoodLog, { id: newLogRef.key, ...entry }]);
  };

  const handleDeleteFoodLog = async (entryId) => {
    await remove(ref(database, `foodLog/${entryId}`));
    setFoodLog(prevFoodLog => prevFoodLog.filter(entry => entry.id !== entryId));
  };

  const handleAddFoodData = async (foodItem) => {
    const newFoodRef = push(ref(database, 'foodDatabase'));
    await set(newFoodRef, foodItem);
    setFoodDatabase(prevFoodDatabase => [...prevFoodDatabase, { id: newFoodRef.key, ...foodItem }]);
  };

  return (
    <Router>
      <div className="App">
        <Navigation />

        <main className="App-main">
          <Routes>
            <Route 
              path="/" 
              element={<DashboardPage tasks={tasks} exerciseHistory={exerciseHistory} foodHistory={foodHistory} caloriesToday={caloriesToday} proteinToday={proteinToday} bmrTarget={bmrTarget} proteinTarget={proteinTarget} />} 
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
