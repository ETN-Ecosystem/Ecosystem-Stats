// src/components/PriceChart.tsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { useTokenData } from '../hooks/useTokenData';

function PriceChart() {
  const { priceChartData } = useTokenData();

  const chartData = {
    labels: priceChartData?.labels || [],
    datasets: [
      {
        label: 'ETN Price (USD)',
        data: priceChartData?.prices || [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    // Add any desired chart options here
  };

  return (
    <div>
      <h2>ETN Price (Last 30 Days)</h2>
      {priceChartData && <Line data={chartData} options={chartOptions} />}
      {!priceChartData && <div>Loading chart data...</div>}
    </div>
  );
}

export default PriceChart;