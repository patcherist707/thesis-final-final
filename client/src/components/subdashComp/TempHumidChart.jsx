import { Line } from 'react-chartjs-2';
import { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import { firestoreClient } from '../../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
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
import { Alert} from 'flowbite-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from 'dayjs';
import Test from '../../test/Test';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function TempHumidChart() {
  const { currentUser } = useSelector((state) => state.user);
  const [tempChartData, settempChartData] = useState({
    labels: [], 
    datasets: [
      {
        label: 'Temperature (°C)',
        data: [],
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.5
      }
    ]
  });
  const [humidChartData, sethumiChartData] = useState({
    labels: [], 
    datasets: [
      {
        label: 'Humidity (%)',
        data: [],
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.5
      }
    ]
  });
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-CA'))
  

  const userId = currentUser._id;
  const formattedSelectedDate = new Date(selectedDate);
  const date = formattedSelectedDate.toLocaleDateString('en-CA');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(false);
        const unsub = onSnapshot(
          collection(firestoreClient, 'temperature_humidity_data', userId, 'Date', date, 'readings'),
          (snapshot) => {
            const data = snapshot.docs.map(doc => doc.data());
            if (data && data.length > 0) {
              setError(false);
              const sortedData = data.sort((a, b) => {
                const timestampA = a.timestamp?.seconds || 0;
                const timestampB = b.timestamp?.seconds || 0;
                return timestampA - timestampB;
              });
  
              // Prepare chart data: extract temperature and timestamp
              const temperatures = sortedData.map(item => item.temperature);
              const relativeHumidity = sortedData.map(item => item.humidity);
              const timestamps = sortedData.map(item => {
                const timestamp = item.timestamp?.seconds * 1000; // Convert to milliseconds
                return new Date(timestamp).toLocaleTimeString(); // Convert to a readable time
              });
  
              
              settempChartData({
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

              sethumiChartData({
                labels: timestamps,
                datasets: [
                  {
                    label: 'Humidity (%)',
                    data: relativeHumidity,
                    borderColor: 'rgba(245, 110, 145, 0.8)',
                    tension: 0.5
                  }
                ]
              });
            } else {
              setError(true);
              setErrorMessage("No valid data available on "+ date);
            }
          }
        );
        return () => unsub();
      } catch (error) {
        setError(true)
        errorMessage('Error fetching data from database');
      }
    };
  
    fetchData();
  }, [userId, date]);
  
  return (
    <div>
      <Paper className='p-20'>
        <div className='w-48 mb-10'>
          <p>Select a date</p>
          <DatePicker 
            selected={selectedDate}
            showIcon
            onChange={(newDate) => {
              setSelectedDate(newDate);
            }}
          />
      
        </div>
        <h1 className="text-xl text-slate-700 text-center font-semibold">Temperature</h1>
        <Line data={tempChartData} />
        <div className='mt-5'>
          <h1 className='text-center font-semibold '>Time</h1>
        </div>
        <div className='m-16'></div>
        <h1 className="text-xl text-slate-700 text-center font-semibold">Relative Humidity</h1>
        <Line data={humidChartData} />
        <div className='mt-5'>
          <h1 className='text-center font-semibold '>Time</h1>
        </div>
        {error && (
          <Alert className='mt-5' color='failure'>
            {errorMessage}
          </Alert>
        )}
      </Paper>
    </div>
  );
}
