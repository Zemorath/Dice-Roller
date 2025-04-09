import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function StatsPage({ history }) {
  // Calculate stats
  const totals = history.map(roll => roll.result.total);
  const average = totals.length > 0 ? (totals.reduce((sum, val) => sum + val, 0) / totals.length).toFixed(2) : 0;
  const mostCommon = totals.length > 0 ? [...totals].sort((a, b) =>
    totals.filter(v => v === b).length - totals.filter(v => v === a).length
  )[0] : 'N/A';

  // Prepare data for bar chart (distribution of totals)
  const totalCounts = {};
  totals.forEach(total => {
    totalCounts[total] = (totalCounts[total] || 0) + 1;
  });
  const chartData = {
    labels: Object.keys(totalCounts).sort((a, b) => a - b),
    datasets: [
      {
        label: 'Roll Totals',
        data: Object.values(totalCounts),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  };

  return (
    <div className="w-full max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Roll Statistics</h1>
      <div className="mb-6">
        <p className="text-lg">Average Roll Total: {average}</p>
        <p className="text-lg">Most Common Total: {mostCommon}</p>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: true, text: 'Distribution of Roll Totals' },
            },
          }}
        />
      </div>
    </div>
  );
}

export default StatsPage;