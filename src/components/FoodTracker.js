import React, { useState, useMemo } from 'react';
import './FoodTracker.css';

function FoodTracker({ foodDatabase, foodLog, onAddFoodLog, onDeleteFoodLog, onAddFoodData }) {
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [customFood, setCustomFood] = useState({
    name: '',
    calories_per_100g: '',
    protein_per_100g: '',
    carbs_per_100g: '',
    fat_per_100g: ''
  });

  const todayKey = new Date().toISOString().split('T')[0];
  const todayLog = foodLog.filter(entry => entry.date === todayKey);

  const matchedFood = useMemo(() => {
    if (!foodName.trim()) return null;
    return foodDatabase.find(item => item.name.toLowerCase() === foodName.trim().toLowerCase());
  }, [foodName, foodDatabase]);

  const quantityValue = parseFloat(quantity);
  const nutrition = useMemo(() => {
    if (!matchedFood || Number.isNaN(quantityValue) || quantityValue <= 0) return null;

    const scale = quantityValue / 100;
    return {
      calories: parseFloat((matchedFood.calories_per_100g * scale).toFixed(1)),
      protein: parseFloat((matchedFood.protein_per_100g * scale).toFixed(1)),
      carbs: parseFloat((matchedFood.carbs_per_100g * scale).toFixed(1)),
      fat: parseFloat((matchedFood.fat_per_100g * scale).toFixed(1))
    };
  }, [matchedFood, quantityValue]);

  const totals = todayLog.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      protein: acc.protein + entry.protein,
      carbs: acc.carbs + entry.carbs,
      fat: acc.fat + entry.fat
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const handleAddLog = () => {
    if (!matchedFood) {
      alert('Please select a food item from the database.');
      return;
    }
    if (Number.isNaN(quantityValue) || quantityValue <= 0) {
      alert('Please enter a valid quantity in grams.');
      return;
    }

    onAddFoodLog({
      id: Date.now(),
      food: matchedFood.name,
      quantity_g: quantityValue,
      calories: nutrition.calories,
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fat: nutrition.fat,
      date: todayKey
    });

    setFoodName('');
    setQuantity('');
  };

  const handleCustomFoodChange = (field, value) => {
    setCustomFood(prev => ({ ...prev, [field]: value }));
  };

  const handleAddCustomFood = () => {
    const { name, calories_per_100g, protein_per_100g, carbs_per_100g, fat_per_100g } = customFood;

    if (!name.trim() || !calories_per_100g.trim() || !protein_per_100g.trim() || !carbs_per_100g.trim() || !fat_per_100g.trim()) {
      alert('Please fill in every field to add a new food.');
      return;
    }

    onAddFoodData({
      name: name.trim(),
      calories_per_100g: parseFloat(calories_per_100g),
      protein_per_100g: parseFloat(protein_per_100g),
      carbs_per_100g: parseFloat(carbs_per_100g),
      fat_per_100g: parseFloat(fat_per_100g)
    });

    setCustomFood({
      name: '',
      calories_per_100g: '',
      protein_per_100g: '',
      carbs_per_100g: '',
      fat_per_100g: ''
    });
  };

  return (
    <div className="food-tracker">
      <div className="food-input-panel">
        <div className="food-entry">
          <h2>Log Food</h2>
          <div className="input-row">
            <label>
              Food name
              <input
                type="text"
                placeholder="Apple"
                value={foodName}
                onChange={e => setFoodName(e.target.value)}
              />
            </label>
            <label>
              Quantity (g)
              <input
                type="number"
                placeholder="150"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                min="1"
              />
            </label>
          </div>

          <div className="nutrition-preview">
            <h3>Nutrition Preview</h3>
            {matchedFood ? (
              quantityValue > 0 ? (
                <div className="nutrition-cards">
                  <div className="nutrition-card">
                    <span>Calories</span>
                    <strong>{nutrition.calories} kcal</strong>
                  </div>
                  <div className="nutrition-card">
                    <span>Protein</span>
                    <strong>{nutrition.protein} g</strong>
                  </div>
                  <div className="nutrition-card">
                    <span>Carbs</span>
                    <strong>{nutrition.carbs} g</strong>
                  </div>
                  <div className="nutrition-card">
                    <span>Fat</span>
                    <strong>{nutrition.fat} g</strong>
                  </div>
                </div>
              ) : (
                <p className="preview-empty">Enter a valid quantity to preview nutrition.</p>
              )
            ) : (
              <p className="preview-empty">Food not found in database yet.</p>
            )}
          </div>

          <button className="log-food-btn" onClick={handleAddLog}>
            Add to Food Log
          </button>
        </div>

        <div className="food-db-panel">
          <h2>Food Database</h2>
          <p>Use the seeded list or add missing food items manually.</p>

          <div className="food-db-list">
            {foodDatabase.slice(0, 6).map(item => (
              <div key={item.name} className="food-db-item">
                <span>{item.name}</span>
                <small>{item.calories_per_100g} kcal / 100g</small>
              </div>
            ))}
          </div>

          <div className="custom-food-form">
            <h3>Add Custom Food</h3>
            <div className="custom-input-row">
              <label>
                Name
                <input
                  type="text"
                  value={customFood.name}
                  onChange={e => handleCustomFoodChange('name', e.target.value)}
                />
              </label>
              <label>
                Calories/100g
                <input
                  type="number"
                  value={customFood.calories_per_100g}
                  onChange={e => handleCustomFoodChange('calories_per_100g', e.target.value)}
                  min="0"
                />
              </label>
              <label>
                Protein/100g
                <input
                  type="number"
                  value={customFood.protein_per_100g}
                  onChange={e => handleCustomFoodChange('protein_per_100g', e.target.value)}
                  min="0"
                />
              </label>
            </div>
            <div className="custom-input-row">
              <label>
                Carbs/100g
                <input
                  type="number"
                  value={customFood.carbs_per_100g}
                  onChange={e => handleCustomFoodChange('carbs_per_100g', e.target.value)}
                  min="0"
                />
              </label>
              <label>
                Fat/100g
                <input
                  type="number"
                  value={customFood.fat_per_100g}
                  onChange={e => handleCustomFoodChange('fat_per_100g', e.target.value)}
                  min="0"
                />
              </label>
              <div className="custom-action" />
            </div>
            <button className="add-food-db-btn" onClick={handleAddCustomFood}>
              Add Food
            </button>
          </div>
        </div>
      </div>

      <div className="food-log-table">
        <h2>Today's Food Log</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Food</th>
                <th>Qty (g)</th>
                <th>Calories</th>
                <th>Protein</th>
                <th>Carbs</th>
                <th>Fat</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {todayLog.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-row">No food logged today.</td>
                </tr>
              ) : (
                todayLog.map(entry => (
                  <tr key={entry.id}>
                    <td>{entry.food}</td>
                    <td>{entry.quantity_g}</td>
                    <td>{entry.calories}</td>
                    <td>{entry.protein}</td>
                    <td>{entry.carbs}</td>
                    <td>{entry.fat}</td>
                    <td>
                      <button className="delete-log-btn" onClick={() => onDeleteFoodLog(entry.id)}>
                        ✕
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {todayLog.length > 0 && (
              <tfoot>
                <tr>
                  <td><strong>Totals</strong></td>
                  <td>—</td>
                  <td><strong>{totals.calories.toFixed(1)}</strong></td>
                  <td><strong>{totals.protein.toFixed(1)}</strong></td>
                  <td><strong>{totals.carbs.toFixed(1)}</strong></td>
                  <td><strong>{totals.fat.toFixed(1)}</strong></td>
                  <td>—</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}

export default FoodTracker;
