import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';

export default function StockCountIn() {
  const [countUp, setCountUp] = useState(null);
  const {currentUser} = useSelector((state) => state.user);
  
  useEffect(() => {
    const uid = currentUser._id;
    const socket = io('http://localhost:3000');
    socket.emit('joinRoom', { uid });
    socket.on('countUpNew', (newData) => {
      setCountUp(newData);
    });
    return () => {
      socket.disconnect();
    };

  }, [currentUser._id]);

  return (
    <div>
      <div className='flex mb-8 justify-between '>
        <div>
          <span className="text-5xl">{countUp}</span>
        </div>
      </div>
      
    </div>
  );
}
