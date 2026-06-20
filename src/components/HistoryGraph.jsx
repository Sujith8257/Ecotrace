import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Filler, 
  Legend 
} from 'chart.js';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Filler, 
  Legend
);

const HistoryGraph = ({ currentTotal }) => {
  const [data, setData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    // Generate some mock history representing a typical user's journey to reduction
    // In a real app, this would be fetched from Supabase via getFootprintHistory
    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Current'];
    
    // Simulate a downward trend leading up to the current total
    const currentNum = parseFloat(currentTotal) || 400;
    const dataPoints = [
      currentNum + 85,
      currentNum + 70,
      currentNum + 40,
      currentNum + 25,
      currentNum + 10,
      currentNum
    ];

    setData({
      labels,
      datasets: [
        {
          fill: true,
          label: 'Monthly Carbon Footprint (kg CO₂e)',
          data: dataPoints,
          borderColor: 'rgb(31, 157, 85)', // brand-green
          backgroundColor: 'rgba(31, 157, 85, 0.1)',
          tension: 0.4,
          pointBackgroundColor: 'rgb(31, 157, 85)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        }
      ]
    });
  }, [currentTotal]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 13, family: "'Inter', sans-serif" },
        bodyFont: { size: 14, weight: 'bold', family: "'Inter', sans-serif" },
        displayColors: false,
        callbacks: {
          label: (context) => `${context.parsed.y} kg CO₂e`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: { family: "'Inter', sans-serif" },
          color: 'rgba(0,0,0,0.5)'
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: { family: "'Inter', sans-serif", weight: '500' },
          color: 'rgba(0,0,0,0.7)'
        }
      }
    }
  };

  return (
    <div className="w-full h-[250px] mt-6">
      <Line data={data} options={options} />
    </div>
  );
};

export default HistoryGraph;
