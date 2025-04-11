import React, { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTokenData } from '../hooks/useTokenData';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function PriceChart() {
  const { priceChartData } = useTokenData();
  const chartRef = useRef<ChartJS | null>(null);

  // Clean up chart instance on unmount
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  if (!priceChartData) {
    return <div className="text-center p-4">Loading chart data...</div>;
  }

  const chartData = {
    labels: priceChartData.labels,
    datasets: [
      {
        label: 'ETN Price (USD)',
        data: priceChartData.prices,
        fill: false,
        borderColor: '#F2C94C',
        backgroundColor: '#F2C94C',
        tension: 0.1,
      },
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#FFFFFF'
        }
      },
      title: {
        display: true,
        text: 'ETN Price (Last 30 Days)',
        color: '#FFFFFF'
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#FFFFFF'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      y: {
        ticks: {
          color: '#FFFFFF'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <Line
        ref={chartRef}
        data={chartData}
        options={chartOptions}
      />
    </div>
  );
}

export default PriceChart;