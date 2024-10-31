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

export default function TempChart() {
  const [chartData, setChartData] = useState(() => {
    const storedData = localStorage.getItem('tempData');
    return storedData ? JSON.parse(storedData) : {
      labels: [], 
      datasets: [
        {
          label: "",
          data: [],
          borderColor: "rgb(75, 192, 192)",
          borderWidth: 1,
          tension: 0.5, 
        }
      ]
    };
  });

  const [data, setData] = useState({ temperature: 0 });

  // useEffect(() => {
  //   const socket = io('http://localhost:4000');
    
  //   // Corrected: Listening to the event
  //   socket.on('updateTempHumidData', (newData) => {
  //     const newValue = newData.temperature;
  //     const now = new Date();

  //     setChartData((prevChartData) => {
  //       const lastTimeLabel = prevChartData.labels.slice(-1)[0];
  //       const lastTime = new Date();

  //       if(lastTimeLabel){
  //         const [lastHours, lastMinutes, lastSeconds] = lastTimeLabel.split(':').map(Number);
  //         lastTime.setHours(lastHours, lastMinutes, lastSeconds);
  //       }

  //       const timeDifference = (now - lastTime) / (1000 * 60); // in minutes

  //       if(timeDifference >= 2 || prevChartData.labels.length === 0){
  //         const timeLabel = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  //         const updatedChartData = {
  //           labels: [...prevChartData.labels, timeLabel],
  //           datasets: prevChartData.datasets.map((dataset) => ({
  //             ...dataset,
  //             data: [...dataset.data, newValue],
  //           })),
  //         };

  //         localStorage.setItem('tempData', JSON.stringify(updatedChartData));

  //         return updatedChartData;
  //       }

  //       return prevChartData;
  //     });

  //     setData(newData);
  //   });

  //   return () => {
  //     socket.disconnect();
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
