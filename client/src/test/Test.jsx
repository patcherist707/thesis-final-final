import React from "react";
import dayjs from 'dayjs';



export default function Test() {
  const date = new Date('Sat Nov 24 2024 08:00:00 GMT+0800 (Philippine Standard Time)');
  const formattedDate = dayjs(date).format('YYYY-DD-MM');

console.log(formattedDate);  // Output: 2024-16-11
  return (
    <div>
      
    </div>
  );
}
