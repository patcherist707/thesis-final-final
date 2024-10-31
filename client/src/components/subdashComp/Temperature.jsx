import GaugeComponent from 'react-gauge-component'
import { useEffect, useState} from "react";

export default function Temperature() {
  return (
    <div>
      <GaugeComponent
        style={{width:'300px', margin: 'auto'}}
          type="semicircle"
          arc={{
            width: 0.3,
            padding: 0.008,
            cornerRadius: 1,
            subArcs: [
              {
                limit: 14,
                color: 'Yellow',
                showTick: true,
                tooltip: {
                  text: 'Suboptimal'
                }
              },
              {
                limit: 21,
                color: 'green',
                showTick: true,
                tooltip: {
                  text: 'Optimal'
                }
              },
              {
                limit: 25,
                color: 'Yellow',
                showTick: true,
                tooltip: {
                  text: 'Suboptimal'
                }
              },
              {
                limit: 30, color: 'orange', showTick: true,
                tooltip: {
                  text: 'Risk'
                }
              },
              {
                limit: 35, color: 'red', showTick: true,
                tooltip: {
                  text: 'Critical'
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
            valueLabel: { formatTextValue: value => value + 'ºC', matchColorWithArc: true },
            tickLabels: {
              type: 'outer',
              valueConfig: { formatTextValue: value => value + 'ºC', fontSize: 10},
              ticks: [
                { value: 17.5 },
                { value: 33 },
                { value: 37 },
              ],
            }
          }}
          value={40}
          minValue={10}
        maxValue={40}
      />
    </div>
  );
}
