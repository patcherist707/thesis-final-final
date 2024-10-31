import GaugeComponent from 'react-gauge-component'
import { useEffect, useState} from "react";
import { useSelector } from 'react-redux';
import io from 'socket.io-client';

export default function Humidity() {
  const [data, setData] = useState({humidity:0});
  const {currentUser} = useSelector((state) => state.user);

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
  return (
    <div>
      {/* <GaugeComponent
        style={{width:'300px', margin:'auto'}}
          type="semicircle"
          arc={{
            width: 0.3,
            padding: 0.008,
            cornerRadius: 1,
            subArcs: [
              {
                limit: 39,
                color: 'red',
                showTick: true,
                tooltip: {
                  text: 'Critical!'
                }
              },
              {
                limit: 49,
                color: 'yellow',
                showTick: true,
                tooltip: {
                  text: 'Acceptable'
                }
              },
              {
                limit: 59,
                color: 'green',
                showTick: true,
                tooltip: {
                  text: 'Ideal'
                }
              },
              {
                limit: 69, 
                color: 'yellow', 
                showTick: true,
                tooltip: {
                  text: 'Acceptable!'
                }
              },
              {
                limit: 79, 
                color: 'orange', 
                showTick: true,
                tooltip: {
                  text: 'High Risk!'
                }
              },
              {
                limit: 100, 
                color: 'Red', 
                showTick: true,
                tooltip: {
                  text: 'Critical!'
                }
              },
          
            ],
          }}
          pointer={{
            color: '#345243',
            length: 0.7,
            width: 13,
          }}
          labels={{
            valueLabel: { formatTextValue: value => value + '%', matchColorWithArc: true},
            tickLabels: {
              type: 'outer',
              valueConfig: { formatTextValue: value => value + '%', fontSize: 10},
              ticks: [
                { value: 10 },
                { value: 20 },
                { value: 30 },
                { value: 90 },  
              ],
            }
          }}
          value={40}
          minValue={0}
        maxValue={100} 
      /> */}
      <div className='flex items-center justify-center mt-16'>
        <span className='text-7xl font-medium text-slate-500'>{data.humidity}%</span>
      </div>
    </div>
  );
}
