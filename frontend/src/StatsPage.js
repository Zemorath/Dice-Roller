import React, { useState, useContext } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { ThemeContext } from './App';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

function StatsPage({ history }) {
  const { theme } = useContext(ThemeContext);
  const [selectedDie, setSelectedDie] = useState('All');

  // Calculate overall stats
  const totals = history.map(roll => roll.result.total);
  const average = totals.length > 0 ? (totals.reduce((sum, val) => sum + val, 0) / totals.length).toFixed(2) : 0;
  const mostCommon = totals.length > 0 ? [...totals].sort((a, b) =>
    totals.filter(v => v === b).length - totals.filter(v => v === a).length
  )[0] || 'N/A' : 'N/A';

  // Per-die-type stats
  const dieTypes = [...new Set(history.map(roll => roll.dice.split('d')[1]))];
  const dieStats = dieTypes.map(sides => {
    const rolls = history.filter(roll => roll.dice.endsWith(`d${sides}`));
    const totals = rolls.map(roll => roll.result.total);
    const avg = totals.length > 0 ? (totals.reduce((sum, val) => sum + val, 0) / totals.length).toFixed(2) : 0;
    const common = totals.length > 0 ? [...totals].sort((a, b) =>
      totals.filter(v => v === b).length - totals.filter(v => v === a).length
    )[0] || 'N/A' : 'N/A';
    return { sides, count: rolls.length, average: avg, mostCommon: common };
  });

  // Bar chart: Distribution of totals, filtered by selected die type
  const filteredTotals = selectedDie === 'All'
    ? totals
    : history
        .filter(roll => roll.dice.endsWith(`d${selectedDie}`))
        .map(roll => roll.result.total);
  const totalCounts = {};
  filteredTotals.forEach(total => {
    totalCounts[total] = (totalCounts[total] || 0) + 1;
  });
  const barData = {
    labels: Object.keys(totalCounts).sort((a, b) => a - b),
    datasets: [
      {
        label: `Roll Totals (d${selectedDie === 'All' ? 'All' : selectedDie})`,
        data: Object.values(totalCounts),
        backgroundColor: theme === 'dark' ? 'rgba(74, 222, 128, 0.5)' : 'rgba(34, 197, 94, 0.5)',
        borderColor: theme === 'dark' ? 'rgba(74, 222, 128, 1)' : 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Line chart: Roll totals over time
  const lineData = {
    labels: history.map((_, i) => i + 1),
    datasets: [
      {
        label: 'Roll Totals',
        data: totals,
        fill: false,
        borderColor: theme === 'dark' ? 'rgba(252, 165, 165, 1)' : 'rgba(239, 68, 68, 1)',
        backgroundColor: theme === 'dark' ? 'rgba(252, 165, 165, 0.5)' : 'rgba(239, 68, 68, 0.5)',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-dark-text">Roll Statistics</h1>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-dark-text">Average Roll Total</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{average}</p>
        </div>
        <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-dark-text">Most Common Total</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{mostCommon}</p>
        </div>
      </div>

      {/* Per-Die-Type Stats */}
      {dieStats.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-dark-text">Per-Die-Type Stats</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dieStats.map(stat => (
              <div key={stat.sides} className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
                <h3 className="text-xl font-semibold text-gray-700 dark:text-dark-text">d{stat.sides}</h3>
                <p className="text-gray-600 dark:text-gray-300">Rolls: {stat.count}</p>
                <p className="text-gray-600 dark:text-gray-300">Average: {stat.average}</p>
                <p className="text-gray-600 dark:text-gray-300">Most Common: {stat.mostCommon}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts with Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-dark-card p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-dark-text">Filter by Die Type</h3>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => setSelectedDie('All')}
                className={`p-3 rounded-lg text-left font-medium transition ${
                  selectedDie === 'All'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-dark-text hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                All Dice
              </button>
              {dieTypes.map(sides => (
                <button
                  key={sides}
                  onClick={() => setSelectedDie(sides)}
                  className={`p-3 rounded-lg text-left font-medium transition ${
                    selectedDie === sides
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-dark-text hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  d{sides}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="lg:col-span-3 grid grid-cols-1 gap-6">
          <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-lg">
            <Bar
              data={barData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top', labels: { color: theme === 'dark' ? '#e5e7eb' : '#374151' } },
                  title: {
                    display: true,
                    text: `Distribution of Roll Totals (d${selectedDie === 'All' ? 'All' : selectedDie})`,
                    font: { size: 16 },
                    color: theme === 'dark' ? '#e5e7eb' : '#374151',
                  },
                },
                scales: {
                  x: {
                    title: { display: true, text: 'Total', color: theme === 'dark' ? '#e5e7eb' : '#374151' },
                    ticks: { color: theme === 'dark' ? '#e5e7eb' : '#374151' },
                  },
                  y: {
                    title: { display: true, text: 'Frequency', color: theme === 'dark' ? '#e5e7eb' : '#374151' },
                    ticks: { color: theme === 'dark' ? '#e5e7eb' : '#374151' },
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
          <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-lg">
            <Line
              data={lineData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top', labels: { color: theme === 'dark' ? '#e5e7eb' : '#374151' } },
                  title: {
                    display: true,
                    text: 'Roll Totals Over Time',
                    font: { size: 16 },
                    color: theme === 'dark' ? '#e5e7eb' : '#374151',
                  },
                },
                scales: {
                  x: {
                    title: { display: true, text: 'Roll Number', color: theme === 'dark' ? '#e5e7eb' : '#374151' },
                    ticks: { color: theme === 'dark' ? '#e5e7eb' : '#374151' },
                  },
                  y: {
                    title: { display: true, text: 'Total', color: theme === 'dark' ? '#e5e7eb' : '#374151' },
                    ticks: { color: theme === 'dark' ? '#e5e7eb' : '#374151' },
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsPage;