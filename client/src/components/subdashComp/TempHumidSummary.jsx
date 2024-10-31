import React, { useEffect, useState } from "react";
import { List, ListItem, Divider } from '@mui/material';
import { RiCheckboxCircleFill } from "react-icons/ri";
import { FaCircleXmark } from "react-icons/fa6";
import TypingDots from "../TypingDots";

export default function TempHumidSummary() {
  const [emcValue, setEmcValue] = useState(''); // Initial state for EMC value
  const [data, setData] = useState({ humidity: 86, temperature: 36 });
  const [status, setStatus] = useState('');
  const [action, setAction] = useState('');
  const [info, setInfo] = useState('');

  useEffect(() => {
    const calculateEmc = () => {
      if ((data.humidity <= 60 && data.humidity < 65) && (data.temperature >= 22 && data.temperature <= 44)) {
        setEmcValue('EMC <= 12.3%');
        setStatus('safe');
        setAction('none');
        setInfo(`The rice can be safely stored for 2-3 months at a moisture level of 14%. If stored for a longer period, the rice should be dried up and reduced to a moisture level of 12%.`);
      } else if ((data.humidity >= 65 && data.humidity < 70) && (data.temperature >= 22 && data.temperature <= 44)) {
        setEmcValue('EMC <= 12.7%');
        setStatus('safe');
        setAction('none');
        setInfo(`The rice can be safely stored for 2-3 months at a moisture level of 14%. If stored for a longer period, the rice should be dried up and reduced to a moisture level of 12%.`);
      } else if ((data.humidity >= 70 && data.humidity < 75) && (data.temperature >= 22 && data.temperature <= 44)) {
        setEmcValue('EMC <= 13.5%');
        setStatus('safe');
        setAction('none');
        setInfo(`The rice can be safely stored for 2-3 months at a moisture level of 14%. If stored for a longer period, the rice should be dried up and reduced to a moisture level of 12%.`);
      } else if ((data.humidity >= 75 && data.humidity < 77) && (data.temperature >= 22 && data.temperature < 24)) {
        setEmcValue('14.3%');
        setStatus('unsafe');
        setAction('adjust exhaust fan');
        setInfo(`The moisture level of rice grain stored in rice sacks will instantly increase up to unsafe levels during rainy season, even when the rice grain was dried well before storage.`);
      } else if ((data.humidity >= 75 && data.humidity < 77) && (data.temperature >= 24 && data.temperature <= 44)) {
        setEmcValue('EMC < 14.0%');
        setStatus('safe');
        setAction('none');
        setInfo(`The rice can be safely stored for 2-3 months at a moisture level of 14%. If stored for a longer period, the rice should be dried up and reduced to a moisture level of 12%.`);
      } else if ((data.humidity >= 77 && data.humidity < 79) && (data.temperature >= 22 && data.temperature < 32)) {
        setEmcValue('14.6% >= EMC >= 14.1%');
        setStatus('unsafe');
        setAction('adjust exhaust fan');
        setInfo(`Most often during at night, adding heat is required in order to adjust the air and bring its moisture content to the right level.`);
      } else if ((data.humidity >= 77 && data.humidity < 79) && (data.temperature >= 32 && data.temperature <= 44)) {
        setEmcValue('EMC < 13.1%');
        setStatus('safe');
        setAction('none');
        setInfo(`While storing rice, the humidity levels should be kept between 12% and 14%, with storage conditions of 25°C temperature and 13% humidity`);
      } else if ((data.humidity >= 79 && data.humidity < 81) && (data.temperature >= 22 && data.temperature < 40)) {
        setEmcValue('14.9% >= EMC >= 14.1%');
        setStatus('unsafe');
        setAction('adjust exhaust fan');
        setInfo(`While storing rice, the humidity levels should be kept between 12% and 14%, with storage conditions of 25°C temperature and 13% humidity`);
      } else if ((data.humidity >= 79 && data.humidity < 81) && (data.temperature >= 40 && data.temperature <= 44)) {
        setEmcValue('EMC < 13.1%');
        setStatus('safe');
        setAction('none');
        setInfo(`While storing rice, the humidity levels should be kept between 12% and 14%, with storage conditions of 25°C temperature and 13% humidity`);
      } else {
        setEmcValue('EMC >= 14.1%');
        setStatus('unsafe');
        setAction('Adjust exhaust fan');
        setInfo(`If the relative humidity goes up to 85% or more at the same temperature, the grain will absorb moisture from the air and reach about 15.5%, which can lead to a decline in quality over time.`);
      }
    };

    // Set initial message and start calculation after data updates
    const timeoutId = setTimeout(() => {
      calculateEmc();
    }, 5000); // Calculate EMC after 5 seconds

    // Cleanup the timeout on component unmount
    return () => clearTimeout(timeoutId);
  }, [data]);

  return (
    <>
      <List>
        <ListItem>
          <div className="flex w-full gap-3">
            <div className="flex-1">Estimated EMC based on current Temperature and RH</div>
            <div className="flex-1 flex items-center">
              {emcValue === '' ? (
                <div className="flex items-center">
                  <span>Calculating EMC </span>
                  <TypingDots/>
                  
                </div>
              ) : (
                emcValue
              )}
            </div>
          </div>
        </ListItem>
        <Divider />
        <ListItem>
          <div className="flex w-full gap-3">
            <div className="flex-1">Status</div>
            <div className="flex-1 flex items-center">
              {status === '' ? (
                <div className="flex items-center">
                  <span>Checking status </span>
                  <TypingDots/>
                  
                </div>
              ) : status === 'safe' ? (
                <>
                  <span><RiCheckboxCircleFill/></span>
                  <span className="ml-2">{status}</span>
                </>
                
              ) : (
                <>
                  <span><FaCircleXmark/></span>
                  <span className="ml-2">{status}</span>
                </>
              )}
            </div>
          </div>
        </ListItem>
        <Divider />
        <ListItem>
          <div className="flex w-full gap-3">
            <div className="flex-1">Required Action</div>
            <div className="flex-1 flex items-center">
              {action === '' ? (
                <div className="flex items-center">
                  <span>Generating required action </span>
                  <TypingDots/>
                  
                </div>
              ) : (
                action
              )}
            </div>
          </div>
        </ListItem>
        <Divider />
        <ListItem>
          <div className="flex w-full gap-3">
            <div className="flex-1">More information</div>
            <div className="flex-1 flex items-center">
              {info === '' ? (
                <div className="flex items-center">
                  <span>Fetching required information </span>
                  <TypingDots/>
                  
                </div>
              ) : (
                info
              )}
            </div>
          </div>
        </ListItem>
        <Divider />
      </List>
    </>
  );
}
