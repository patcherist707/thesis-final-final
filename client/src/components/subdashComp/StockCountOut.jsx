import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';

export default function StockCountOut() {
  const [countDown, setCountDown] = useState(0);
  const {currentUser} = useSelector((state) => state.user);
  useEffect(() => {
    const uid = currentUser._id;
    const socket = io('http://localhost:3000');
    socket.emit('joinRoom', { uid });
    socket.on('countDownNew', (newData) => {
      setCountDown(newData);
    });
      return () => {
      socket.disconnect();
    };

  }, []);

  console.log(countDown)
  
  return (
    <div>
      <div>
        <span className='text-5xl'>{countDown}</span>
      </div>
    </div>
  );
}
