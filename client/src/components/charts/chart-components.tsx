import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Common chart options
const commonOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleFont: {
        size: 14,
      },
      bodyFont: {
        size: 13,
      },
    },
  },
  interaction: {
    mode: 'index',
    intersect: false,
  },
};

// Line chart options
const lineChartOptions: ChartOptions<'line'> = {
  ...commonOptions,
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      },
    },
  },
};

// Bar chart options
const barChartOptions: ChartOptions<'bar'> = {
  ...commonOptions,
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      },
    },
  },
};

// Doughnut chart options
const doughnutChartOptions: ChartOptions<'doughnut'> = {
  ...commonOptions,
  cutout: '70%',
  plugins: {
    ...commonOptions.plugins,
    legend: {
      position: 'bottom',
    },
  },
};

// Chart component props interface
interface ChartProps {
  data: ChartData<any, any, any>;
  options?: ChartOptions<any>;
}

// Line Chart Component
export const LineChart: React.FC<ChartProps> = ({ data, options }) => {
  return <Line data={data} options={options || lineChartOptions} />;
};

// Bar Chart Component
export const BarChart: React.FC<ChartProps> = ({ data, options }) => {
  return <Bar data={data} options={options || barChartOptions} />;
};

// Doughnut Chart Component
export const DoughnutChart: React.FC<ChartProps> = ({ data, options }) => {
  return <Doughnut data={data} options={options || doughnutChartOptions} />;
};