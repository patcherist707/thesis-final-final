import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend
} from 'chart.js';
import { useEffect, useState } from 'react';
// import io from 'socket.io-client';
import Paper from '@mui/material/Paper';

ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend
);

export default function HumidChart() {
  // Initialize chart data with values from localStorage or empty data
  const [chartData, setChartData] = useState(() => {
    const storedData = localStorage.getItem('humidData');
    return storedData ? JSON.parse(storedData) : {
      labels: [], 
      datasets: [
        {
          label: "",
          data: [],
          borderColor: "blue",
          borderWidth: 1,
          tension: 0.5,
        }
      ]
    };
  });

  const [data, setData] = useState({ humidity: 0 }); // Track the current humidity value

  // useEffect(() => {
  //   const socket = io('http://localhost:4000'); // Connect to Socket.IO server
    
  //   socket.on('updateTempHumidData', (newData) => {
  //     const newValue = newData.humidity;
  //     const now = new Date();

  //     setChartData((prevChartData) => {
  //       const lastTimeLabel = prevChartData.labels.slice(-1)[0]; // Get last label (time)
  //       const lastTime = new Date();

  //       if (lastTimeLabel) {
  //         const [lastHours, lastMinutes, lastSeconds] = lastTimeLabel.split(':').map(Number);
  //         lastTime.setHours(lastHours, lastMinutes, lastSeconds); // Reconstruct the last time
  //       };

  //       const timeDifference = (now - lastTime) / (1000 * 60); // Time difference in minutes
  //       console.log("Time difference:", timeDifference); // Debugging log for time difference
        
  //       // Check if at least 30 minutes have passed
  //       if (timeDifference >= 2 || prevChartData.labels.length === 0) {
  //         const timeLabel = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

  //         const updatedChartData = {
  //           labels: [...prevChartData.labels, timeLabel], // Add new time label
  //           datasets: prevChartData.datasets.map((dataset) => ({
  //             ...dataset,
  //             data: [...dataset.data, newValue], // Add new humidity value
  //           })),
  //         };

  //         console.log("Updating chart data with:", updatedChartData); // Debugging log for new chart data

  //         localStorage.setItem('humidData', JSON.stringify(updatedChartData)); // Save to localStorage

  //         return updatedChartData;
  //       }

  //       return prevChartData; // Return the current data if 30 minutes haven't passed
  //     });

  //     setData(newData); // Update the state with the new data for other uses
  //   });

  //   return () => {
  //     socket.disconnect(); // Disconnect the socket on component unmount to avoid memory leaks
  //   };
  // }, []);

  return (
    <div>
      <Paper>
        <Line 
          data={chartData} 
          options={
            { responsive: true,
              scales: {
                y: {
                  ticks: {
                    callback: function(value) {
                      return value.toFixed(1);
                    }
                  }
                }
              }

           }} 
          className='p-3 mb-5' 
        />
      </Paper>
    </div>
  );
}
