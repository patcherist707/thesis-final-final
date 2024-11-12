import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

export default function StockCountIn() {
  const [countUp, setCountUp] = useState(null);
  
  useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('countUpNew', (newData) => {
      setCountUp(newData);
    });
    return () => {
      socket.disconnect();
    };

  }, []);

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
