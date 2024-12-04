
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
  const [rfidCapacity, setRfidCapacity] = useState({}); 

  const socket = io('http://localhost:3000');

  useEffect(() => {
    const uid = currentUser._id;
    
    socket.emit('joinRoom', { uid });
    socket.on('updateTempHumidData', (newData) => {
      setData(newData);
    });
    return () => {
      socket.disconnect();
    }
  }, [currentUser]);

  useEffect(() => {
    socket.on('updateCapacityValue', (value) => {
      setRfidCapacity(value);
    });

    return () => {
      socket.disconnect();
    }
  }, []);

  useEffect(() => {
    const checkForAlerts = () => {
      const idealTemperature = 20;
     
      const addAlertToQueue = (newAlert) => {
        setAlertsQueue((prev) => {
          const updatedQueue = [...prev, newAlert];
          return updatedQueue.length > 10 ? updatedQueue.slice(-10) : updatedQueue;
        });
      };
    
      if (data.temperature > idealTemperature) {
        const newAlert = `Your sensor has recorded a temperature of ${data.temperature}°C that is more than the required 20°C. This increase in temperature may impact the quality of stored rice. Please lower the temperature to maintain the ideal threshold and prevent potential spoilage or degradation.`;
        addAlertToQueue(newAlert);
      }
    
      if (data.temperature === idealTemperature && (data.humidity < 40 || data.humidity > 80)) {
        const newAlert = `Your sensor has recorded a temperature of ${data.temperature}°C and humidity of ${data.humidity}%. Adjust the cooling system to lower the temperature and consider using a dehumidifier to maintain ideal humidity levels. Maintain a 40%-80% humidity level with a temperature of 20°C.`;
        addAlertToQueue(newAlert);
      }
    
      if (parseFloat(rfidCapacity.percentage) > 100) {
        const newAlert = `Stock Level Overloaded. Immediately stop adding more stock. Consider redistributing or moving some rice sacks to another storage area. Inspect for potential damage due to overloading and ensure proper airflow to prevent spoilage.`;
        addAlertToQueue(newAlert);
      }
    
      if (parseFloat(rfidCapacity.percentage) < 30 && parseFloat(rfidCapacity.percentage) >= 10) {
        const newAlert = `Stock is at a low level. Plan to replenish stock soon to avoid running out. Ensure the remaining stock is in good condition and consider cleaning or reorganizing the storage space.`;
        addAlertToQueue(newAlert);
      }
    
      if (parseFloat(rfidCapacity.percentage) < 10 && parseFloat(rfidCapacity.percentage) >= 1) {
        const newAlert = `Stock is at a critically low level. Immediately reorder stock to avoid shortages. Ensure the quality of the remaining stock and prepare the storage for incoming rice.`;
        addAlertToQueue(newAlert);
      }
    
      if (parseFloat(rfidCapacity.percentage) === 0) {
        const newAlert = `No stocks available. Prepare the warehouse for the next batch of rice sacks. Clean the storage area thoroughly and conduct maintenance checks to ensure it's ready for new stock.`;
        addAlertToQueue(newAlert);
      }
    };
    

    const interval = setInterval(() => {
      checkForAlerts();
    }, 2000);

    return () => clearInterval(interval);
  }, [data.temperature, data.humidity, rfidCapacity.percentage]);
  
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

  return (
    <div>
      <AlertModal 
        isOpen={isModalOpen} 
        alerts={alertsQueue}  
        onClose={closeAlert} 
        onCloseAll={closeAllAlerts}
      />
    </div>
  );
}
