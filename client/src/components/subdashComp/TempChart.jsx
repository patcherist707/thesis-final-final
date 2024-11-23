import { Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import { firestoreClient } from '../../firebase';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { useSelector } from 'react-redux';
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
  const { currentUser } = useSelector((state) => state.user);
  const [chartData, setChartData] = useState({
    labels: [], // Initialize labels as empty array
    datasets: [
      {
        label: 'Temperature (°C)',
        data: [], // Initialize data as empty array
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.5
      }
    ]
  });

  const userId = currentUser._id;
  const date = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Set up Firestore snapshot listener for real-time updates
        const unsub = onSnapshot(
          collection(firestoreClient, 'temperature_humidity_data', userId, 'Date', date, 'readings'),
          (snapshot) => {
            const data = snapshot.docs.map(doc => doc.data());
  
            if (data && data.length > 0) {
              // Sort data based on timestamp (ascending order)
              const sortedData = data.sort((a, b) => {
                const timestampA = a.timestamp?.seconds || 0;
                const timestampB = b.timestamp?.seconds || 0;
                return timestampA - timestampB;
              });
  
              // Prepare chart data: extract temperature and timestamp
              const temperatures = sortedData.map(item => item.temperature);
              const timestamps = sortedData.map(item => {
                const timestamp = item.timestamp?.seconds * 1000; // Convert to milliseconds
                return new Date(timestamp).toLocaleTimeString(); // Convert to a readable time
              });
  
              // Update chart data
              setChartData({
                labels: timestamps,
                datasets: [
                  {
                    label: 'Temperature (°C)',
                    data: temperatures,
                    borderColor: 'rgba(75,192,192,1)',
                    tension: 0.5
                  }
                ]
              });
            } else {
              console.log('No valid data available');
            }
          }
        );
  
        // Cleanup listener when component unmounts
        return () => unsub();
      } catch (error) {
        console.error('Error fetching data from Firestore:', error);
      }
    };
  
    fetchData();
  }, [userId, date]); // This will re-fetch data when the date or userId changes
  

  return (
    <div>
      <Paper>
        <Line data={chartData} />
      </Paper>
    </div>
  );
}
