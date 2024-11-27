
import React, { useState, useEffect } from 'react';
import AlertModal from '../test/AlertModal';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';

export default function Alert() {
  const {currentUser} = useSelector((state) => state.user);
  const [data, setData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);  
  const [alertMessage, setAlertMessage] = useState(''); 
  const [alertsQueue, setAlertsQueue] = useState([]); 

  useEffect(() => {
    const uid = currentUser._id;
    const socket = io('http://localhost:3000');
    socket.emit('joinRoom', { uid });
    socket.on('updateTempHumidData', (newData) => {
      setData(newData);
    });
    return () => {
      socket.disconnect();
    }
  }, [currentUser]);

  useEffect(() => {
    const checkForAlerts = () => {
      const idealTemperature = 20;
      if ((data.temperature > idealTemperature)) {
        const newAlert = `Your sensor has recorded a temperature of ${data.temperature} that is more than the required 20C`;
        setAlertsQueue((prev) => [...prev, newAlert]);
      }

      if((data.temperature == idealTemperature) && (data.humidity < 40 || data.humidity > 80)){
        const newAlert = `Your sensor has recorded a temperature of ${data.temperature} and humidty of ${data.humidity}`;
        setAlertsQueue((prev) => [...prev, newAlert]);
      }


    };

    const interval = setInterval(() => {
      checkForAlerts();
    }, 5000);

    return () => clearInterval(interval);
  }, [data.temperature, data.humidity]);

  useEffect(() => {
    if (alertsQueue.length > 0 && !isModalOpen) {
      const nextAlert = alertsQueue[0];
      setAlertMessage(nextAlert);
      setIsModalOpen(true);
      setAlertsQueue((prev) => prev.slice(1));
    }
  }, [alertsQueue, isModalOpen]);

  const closeAlert = () => {
    setIsModalOpen(false);
  };
  const closeAllAlerts = () => {
    setAlertsQueue([]);  // Clear the queue of alerts
    setIsModalOpen(false);  // Close the modal
  };



  console.log(alertsQueue);
  return (
    <div className="dashboard" >
      <AlertModal 
        isOpen={isModalOpen} 
        alerts={alertsQueue}  
        onClose={closeAlert} 
        onCloseAll={closeAllAlerts}
      />
    </div>
  );
}
