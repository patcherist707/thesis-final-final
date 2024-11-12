import React, { useEffect, useState } from "react";
import { 
  List, 
  ListItem, 
  Divider, 
} from '@mui/material';
import { Alert} from 'flowbite-react';
import { Modal, TextInput, Button } from 'flowbite-react';
import { FaRegEdit } from "react-icons/fa";
import TypingDots from "../TypingDots";
import { useSelector } from "react-redux";
import io from 'socket.io-client';

export default function StocksSummary() {
  const { currentUser, err } = useSelector((state) => state.user);
  const [iconSize, setIconSize] = useState(18);
  const [countUp, setCountUp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [maxCapacity, setMaxCapacity] = useState({maxCap: 0});
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [data, setData] = useState({});
  const [status, setStatus] = useState('');
  const [action, setAction] = useState('');

  useEffect(() => {
    const statAndAction = () => {
      if (parseFloat(data.percentage) > 100) {
        setStatus('Capacity OverLoaded')
        setAction(' Immediately stop adding more stock. Consider redistributing or moving some rice sacks to another storage area. Inspect for potential damage due to overloading and ensure proper airflow to prevent spoilage.');
      } else if (parseFloat(data.percentage) === 100) {
        setStatus('Full Capacity');
        setAction('Do not add more stock. Ensure the current stock is properly organized for easy access. Monitor the storage for any signs of moisture or pests. Plan for future space needs as soon as possible.');
      } else if(parseFloat(data.percentage) >= 70 && parseFloat(data.percentage) < 100){
        setStatus('Nearly Full');
        setAction('No immediate action needed but start planning for incoming stock. Monitor humidity and temperature conditions to maintain the quality of stored rice. Begin scheduling deliveries or usage to create space.')
      } else if(parseFloat(data.percentage) < 70 && parseFloat(data.percentage) >= 50){
        setStatus('More than half full');
        setAction('Stock levels are in a comfortable range. Check for any quality degradation due to long-term storage. Plan stock rotation to ensure older rice sacks are used first.');
      }else if(parseFloat(data.percentage) < 50 && parseFloat(data.percentage) >= 30){
        setStatus('Less than half full');
        setAction('Continue regular stock checks. You may want to reorder stock soon, depending on demand projections. Inspect for pests and ensure proper ventilation.');
      }else if(parseFloat(data.percentage) < 30 && parseFloat(data.percentage) >= 10){
        setStatus('Low capacity');
        setAction('Plan to replenish stock soon to avoid running out. Ensure the remaining stock is in good condition and consider cleaning or reorganizing the storage space.');
      }else if(parseFloat(data.percentage) < 10 && parseFloat(data.percentage) >= 1){
        setStatus('Critically low capacity');
        setAction('Immediately reorder stock to avoid shortages. Ensure the quality of the remaining stock and prepare the storage for incoming rice.');
      }else if(parseFloat(data.percentage) === 0){
        setStatus('Empty');
        setAction(`Prepare the warehouse for the next batch of rice sacks. Clean the storage area thoroughly and conduct maintenance checks to ensure it's ready for new stock.`);
      }else{
        setStatus('Generating required action');
      }
    }

    const timeoutId = setTimeout(() => {
      statAndAction();
    }, 5000); 

    return () => clearTimeout(timeoutId);
  }, [data.percentage]);

  useEffect(() => {
    const socket = io('http://localhost:3000');
    socket.on('updateCapacityValue', (newData) => {
      setData(newData);
    });

    return () => {
      socket.disconnect();
    }
  }, []);

  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('countUpNew', (newData) => {
      setCountUp(newData);
    });
    return () => {
      socket.disconnect();
    };

  }, []);

  const handleChange = (e) => {
    setMaxCapacity({ maxCapacityValue: e.target.value, countUp});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    if (!maxCapacity.maxCapacityValue) {
      return setErrorMessage('Please enter a value');
    }
    if (maxCapacity.maxCapacityValue <= 0) {
      return setErrorMessage('Please enter a value that is more than 0');
    }

    try {
      setErrorMessage(null);
      const res = await fetch(`/api/capacity/${currentUser._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(maxCapacity),
      });

      const data = await res.json();

      if (data.success === false) {
        return setErrorMessage(data.message);
      }

      if (res.ok) {
        setSuccessMessage('Updated Successfully');
        setErrorMessage(null);
      }

    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <>
      <List>
        <ListItem>
        <div className="flex w-full gap-3">
            <div className="flex-1">Maximum Stocks</div>
            <div className="flex-1">
              <div className="flex flex-row justify-between">
                <div>{data.maxCapacityValue}</div>
                <div 
                  className="cursor-pointer"
                  onMouseEnter={() => setIconSize(20)} 
                  onMouseLeave={() => setIconSize(18)}
                  onClick={() => setShowModal(true) || setSuccessMessage(null) || setErrorMessage(null)}
                >
                  <FaRegEdit size={`${iconSize}px`} />
                </div>
              </div>
              
            </div>
          </div>
        </ListItem>
        <Divider/>
        <ListItem>
          <div className="flex w-full gap-3">
            <div className="flex-1">Capacity Per.</div>
            <div className="flex-1">{((countUp/ parseFloat(data.maxCapacityValue)) * 100).toFixed(2)}%</div>
          </div>
        </ListItem>
        <Divider/>
        <ListItem>
          <div className="flex w-full gap-3">
            <div className="flex-1">Capacity Status</div>
            <div className="flex-1 flex items-center">
              {status === '' ? (
                <div className="flex items-center">
                  <span>Fetching required information </span>
                  <TypingDots/>
                  
                </div>
              ) : (
                status
              )}
            </div>
          </div>
        </ListItem>
        <Divider/>
        <ListItem>
          <div className="flex w-full gap-3">
            <div className="flex-1">Required Action</div>
            <div className="flex-1 flex items-center">
              {action === '' ? (
                <div className="flex items-center">
                  <span>Fetching required information </span>
                  <TypingDots/>
                  
                </div>
              ) : (
                action
              )}
            </div>
          </div>
        </ListItem>
        <Divider/>
      </List>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size={'sm'}
      >
        <Modal.Header />
        <Modal.Body>
          <div className='flex flex-col gap-2 w-full'>
            <h1 className='text-base text-center'>Enter Maximum Capacity</h1>
            <form className='flex flex-col gap-2' onSubmit={handleSubmit}>
              <TextInput placeholder='Value' type='number' onChange={handleChange} id='value' />
              <Button size={'sm'} type='submit'>Submit</Button>
            </form>
            {errorMessage && (
              <Alert color={'failure'} className='mt-1 w-full break-words'>
                {errorMessage}
              </Alert>
            )}
            {successMessage && (
              <Alert color={'success'} className='mt-1 w-full break-words'>
                {successMessage}
              </Alert>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
          
