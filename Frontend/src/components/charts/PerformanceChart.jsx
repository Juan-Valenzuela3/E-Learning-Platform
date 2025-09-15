import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const PerformanceChart = ({ data, title }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#111827', // gray-900
          font: {
            family: 'Inter, sans-serif',
          },
        },
      },
      title: {
        display: true,
        text: title,
        color: '#111827', // gray-900
        font: {
          size: 16,
          family: 'Inter, sans-serif',
          weight: 600,
        },
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#111827', // gray-900
        bodyColor: '#4B5563', // gray-600
        borderColor: '#E5E7EB', // gray-200
        borderWidth: 1,
        padding: 12,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280', // gray-500
        },
      },
      y: {
        grid: {
          color: '#F3F4F6', // gray-100
        },
        ticks: {
          color: '#6B7280', // gray-500
        },
        min: 0,
        max: 100,
      },
    },
    elements: {
      line: {
        tension: 0.3,
        borderWidth: 2,
      },
      point: {
        radius: 4,
        hoverRadius: 6,
        hoverBorderWidth: 2,
      },
    },
  };

  const chartData = {
    labels: data?.labels || [],
    datasets: [
      {
        label: 'Rendimiento',
        data: data?.values || [],
        borderColor: '#EF4444', // red-500
        backgroundColor: 'rgba(239, 68, 68, 0.1)', // red-500 con opacidad
        fill: true,
        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: '#EF4444', // red-500
        pointHoverBackgroundColor: '#EF4444', // red-500
        pointHoverBorderColor: '#FFFFFF',
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <Line options={options} data={chartData} />
    </div>
  );
};

export default PerformanceChart;
