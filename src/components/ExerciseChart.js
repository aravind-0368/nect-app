import React, { useMemo } from 'react';
import './ExerciseChart.css';

function ExerciseChart({ history, title = 'Trend', viewType = 'daily', unitLabel = 'units' }) {
  const chartData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let data = [];

    if (viewType === 'daily') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const count = history[dateStr] || 0;
        data.push({
          label: days[date.getDay()],
          value: count,
          date: dateStr
        });
      }
    } else if (viewType === 'weekly') {
      for (let week = 3; week >= 0; week--) {
        let weekTotal = 0;
        for (let day = 6; day >= 0; day--) {
          const date = new Date();
          date.setDate(date.getDate() - (week * 7 + day));
          const dateStr = date.toISOString().split('T')[0];
          weekTotal += history[dateStr] || 0;
        }
        data.push({
          label: `Week ${4 - week}`,
          value: weekTotal,
          date: new Date(new Date().setDate(new Date().getDate() - week * 7)).toISOString().split('T')[0]
        });
      }
    }

    return data;
  }, [history, viewType]);

  const maxValue = Math.max(...chartData.map(d => d.value), 1);
  const maxHeight = 200;

  return (
    <div className="exercise-chart">
      <h3>{title} ({viewType === 'daily' ? '7 Days' : '4 Weeks'})</h3>
      <div className="chart-container">
        <div className="chart-bars">
          {chartData.map((item, index) => (
            <div key={index} className="bar-item">
              <div className="bar-wrapper">
                <div
                  className="bar"
                  style={{
                    height: `${(item.value / maxValue) * maxHeight}px`,
                    backgroundColor: item.value > 0 ? '#4CAF50' : '#e0e0e0'
                  }}
                  title={`${item.label}: ${item.value} ${unitLabel}`}
                />
              </div>
              <span className="bar-label">{item.label}</span>
            </div>
          ))}
        </div>
        <div className="chart-y-axis">
          <span className="axis-label">{maxValue}</span>
          <span className="axis-label">{Math.ceil(maxValue / 2)}</span>
          <span className="axis-label">0</span>
        </div>
      </div>
    </div>
  );
}

export default ExerciseChart;
