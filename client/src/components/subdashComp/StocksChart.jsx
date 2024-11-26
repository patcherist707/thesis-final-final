import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { collection, onSnapshot} from 'firebase/firestore';
import { firestoreClient } from '../../firebase';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Paper from '@mui/material/Paper';
import { Alert, TextInput, Button} from 'flowbite-react';
import DatePicker from "react-datepicker";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function StocksChart() {
  const { currentUser } = useSelector((state) => state.user);
  const [inflowChartData, setInflowChartData] = useState({
    labels: [], // X-axis labels
    datasets: [
      {
        label: 'Data',
        data: [], // Y-axis data
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(61, 49, 55, 0.2)',
          'rgba(208, 49, 255, 0.2)',
          'rgba(208, 200, 0, 0.2)',
          'rgba(0, 102, 0, 0.2)',
          'rgba(255, 74, 0, 0.2)',
          'rgba(30, 74, 95, 0.2)',
          'rgba(218, 214, 67, 0.2)',
          'rgba(194, 72, 223, 0.2)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(153, 203, 138)',
          'rgb(123, 99, 138)',
          'rgb(123, 99, 247)',
          'rgb(123, 198, 247)',
          'rgb(73, 205, 247)',
          'rgb(73, 205, 169)',
          'rgb(73, 205, 26)',
          'rgb(73, 49, 26)',
        ],
        borderWidth: 1,
      }
    ]
  });
  const [outflowChartData, setOutflowChartData] = useState({
    labels: [], // X-axis labels
    datasets: [
      {
        label: 'Data',
        data: [], // Y-axis data
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(61, 49, 55, 0.2)',
          'rgba(208, 49, 255, 0.2)',
          'rgba(208, 200, 0, 0.2)',
          'rgba(0, 102, 0, 0.2)',
          'rgba(255, 74, 0, 0.2)',
          'rgba(30, 74, 95, 0.2)',
          'rgba(218, 214, 67, 0.2)',
          'rgba(194, 72, 223, 0.2)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(153, 203, 138)',
          'rgb(123, 99, 138)',
          'rgb(123, 99, 247)',
          'rgb(123, 198, 247)',
          'rgb(73, 205, 247)',
          'rgb(73, 205, 169)',
          'rgb(73, 205, 26)',
          'rgb(73, 49, 26)',
        ],
        borderWidth: 1,
      }
    ]
  });
  const chartOptions = {
  responsive: true,
  indexAxis: 'y', 

  };
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState(`${new Date().getFullYear()}`)
  
  const uid = currentUser._id;
  const formattedSelectedYear = new Date(selectedDate);
  const fullYear = formattedSelectedYear.getFullYear();
  const year = `${fullYear}`;
  const handleClose = () => {
    setError(false); 
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(false);

        const yearCollectionRef = collection(firestoreClient, 'monthlyInflow', uid, year);
        const unsub = onSnapshot(yearCollectionRef, (yearSnapshot) => {
          if (yearSnapshot.empty) {
            setError(true);
            setErrorMessage(`No inflow data available for year ${year}`);
            return;
          }
          const monthMap = new Map([
            ["01", "January"], ["02", "February"], ["03", "March"], ["04", "April"],
            ["05", "May"], ["06", "June"], ["07", "July"], ["08", "August"],
            ["09", "September"], ["10", "October"], ["11", "November"], ["12", "December"]
          ]);
          const fetchedData = [];
          yearSnapshot.forEach((monthDoc) => {
            const monthData = monthDoc.data();
            const month = monthDoc.id;
          
            // Convert numeric month (e.g., "01", "02") to month name
            const monthName = monthMap.get(month);
          
            // Push the data with the month name
            fetchedData.push({ month: monthName, ...monthData });
          });

          const month = fetchedData.map(item => item.month);
          const value = fetchedData.map(item => item.totalInFlow);

          setInflowChartData({
            labels: month, // X-axis labels
            datasets: [
              {
                label: 'Data',
                data: value, // Y-axis data
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                  'rgba(255, 205, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(61, 49, 55, 0.2)',
                  'rgba(208, 49, 255, 0.2)',
                  'rgba(208, 200, 0, 0.2)',
                  'rgba(0, 102, 0, 0.2)',
                  'rgba(255, 74, 0, 0.2)',
                  'rgba(30, 74, 95, 0.2)',
                  'rgba(218, 214, 67, 0.2)',
                  'rgba(194, 72, 223, 0.2)',
                ],
                borderColor: [
                  'rgb(255, 99, 132)',
                  'rgb(255, 159, 64)',
                  'rgb(255, 205, 86)',
                  'rgb(75, 192, 192)',
                  'rgb(153, 203, 138)',
                  'rgb(123, 99, 138)',
                  'rgb(123, 99, 247)',
                  'rgb(123, 198, 247)',
                  'rgb(73, 205, 247)',
                  'rgb(73, 205, 169)',
                  'rgb(73, 205, 26)',
                  'rgb(73, 49, 26)',
                ],
                borderWidth: 1,
              }
            ]
          })
          
        });
        
        return () => unsub();
      } catch (error) {
        setError(true);
        setErrorMessage('Error fetching data from database');
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [uid, year]); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(false);

        const yearCollectionRef = collection(firestoreClient, 'monthlyOutflow', uid, year);

        // Listen to snapshots of the year collection
        const unsub = onSnapshot(yearCollectionRef, (yearSnapshot) => {
          if (yearSnapshot.empty) {
            setError(true);
            setErrorMessage(`No otflow data available for year ${year}`);
            return;
          }
          const monthMap = new Map([
            ["01", "January"], ["02", "February"], ["03", "March"], ["04", "April"],
            ["05", "May"], ["06", "June"], ["07", "July"], ["08", "August"],
            ["09", "September"], ["10", "October"], ["11", "November"], ["12", "December"]
          ]);
          const fetchedData = [];
          yearSnapshot.forEach((monthDoc) => {
            const monthData = monthDoc.data();
            const month = monthDoc.id;
          
            // Convert numeric month (e.g., "01", "02") to month name
            const monthName = monthMap.get(month);
          
            // Push the data with the month name
            fetchedData.push({ month: monthName, ...monthData });
          });

          const month = fetchedData.map(item => item.month);
          const value = fetchedData.map(item => item.totalInFlow);

          setOutflowChartData({
            labels: month, // X-axis labels
            datasets: [
              {
                label: 'Data',
                data: value, // Y-axis data
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                  'rgba(255, 205, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(61, 49, 55, 0.2)',
                  'rgba(208, 49, 255, 0.2)',
                  'rgba(208, 200, 0, 0.2)',
                  'rgba(0, 102, 0, 0.2)',
                  'rgba(255, 74, 0, 0.2)',
                  'rgba(30, 74, 95, 0.2)',
                  'rgba(218, 214, 67, 0.2)',
                  'rgba(194, 72, 223, 0.2)',
                ],
                borderColor: [
                  'rgb(255, 99, 132)',
                  'rgb(255, 159, 64)',
                  'rgb(255, 205, 86)',
                  'rgb(75, 192, 192)',
                  'rgb(153, 203, 138)',
                  'rgb(123, 99, 138)',
                  'rgb(123, 99, 247)',
                  'rgb(123, 198, 247)',
                  'rgb(73, 205, 247)',
                  'rgb(73, 205, 169)',
                  'rgb(73, 205, 26)',
                  'rgb(73, 49, 26)',
                ],
                borderWidth: 1,
              }
            ]
          })
          
        });
        
        return () => unsub();
      } catch (error) {
        setError(true);
        setErrorMessage('Error fetching data from database');
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, [uid, year]);
  


  return (
    <div>
      <Paper className="p-10">
        <div className='mb-2 items-center '>
          <h1 className='mb-2'>Select Year:</h1>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy"
            showYearPicker
            className="w-24 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                popperClassName="shadow-lg border border-gray-200 rounded-lg"
          />
            
        </div>

        <div className='mb-5 flex'>
        {error && (
        <Alert className='mt-5' color='failure'>
        <div className='flex justify-between items-center'>
          <div className='flex-1'>
            <span>{errorMessage}</span>
          </div>
          <div className='ml-4'>
            <Button
              size="sm"
              color='transparent'
              onClick={handleClose}
            >
              Close
            </Button>
          </div>
        </div>
      </Alert>
      )}
        </div>
        
        <div className='flex flex-col lg:flex-row gap-8'>
          <div className="w-full lg:w-6/12">
            <h1 className="text-lg text-slate-700 text-center font-semibold mb-5">Monthly Inflow</h1>
            <Bar data={inflowChartData} options={chartOptions} />
          </div>
          <div className="w-full lg:w-6/12">
            <h1 className="text-lg text-slate-700 text-center font-semibold mb-5">Monthly Outflow</h1>
            <Bar data={outflowChartData} options={chartOptions} />
          </div>
        </div>
        
      </Paper>
    </div>
  );
}
