import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

export default function StockCountOut() {
  const [countDown, setCountDown] = useState(0);
 
  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('countDownNew', (newData) => {
      setCountDown(newData);
    });
      return () => {
      socket.disconnect();
    };

  }, []);
  
  return (
    <div>
      <div>
        <span className='text-5xl'>{countDown}</span>
      </div>
    </div>
  );
}
