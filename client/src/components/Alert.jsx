
import React, { useState, useEffect } from 'react';
import AlertModal from '../utils/AlertModal';
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
        const newAlert = `Your sensor has recorded a temperature of ${data.temperature}°C that is more than the required 20°C. This increase in temperature may impact the quality of stored items. Please lower the temperature to maintain the ideal threshold and prevent potential spoilage or degradation.
        `;
        setAlertsQueue((prev) => [...prev, newAlert]);
      }

      if((data.temperature == idealTemperature) && (data.humidity < 40 || data.humidity > 80)){
        const newAlert = `Your sensor has recorded a temperature of ${data.temperature}°C and humidty of ${data.humidity}%. Adjust the cooling system to lower the temperature and consider using a dehumidifier to maintain ideal humidity levels. Maintain a <b>${`40%-50%`}</b> with a temperature of 20°C`;
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
    setAlertsQueue([]); 
    setIsModalOpen(false);  
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
