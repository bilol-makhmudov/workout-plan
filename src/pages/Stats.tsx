import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { Card } from 'react-bootstrap';
import { WorkoutLogs } from '../types';

interface SeriesPoint { date: string; weight: number; }

type Series = Record<string, SeriesPoint[]>;

const buildSeries = (logs: WorkoutLogs): Series => {
  const series: Series = {};
  Object.keys(logs).forEach(date => {
    const exs = logs[date].exercises || {};
    Object.keys(exs).forEach(name => {
      const weights = exs[name].filter(w => typeof w === 'number') as number[];
      if (weights.length === 0) return;
      const maxW = Math.max(...weights);
      if (!series[name]) series[name] = [];
      series[name].push({ date, weight: maxW });
    });
  });
  Object.values(series).forEach(arr => arr.sort((a,b)=>new Date(a.date).getTime()-new Date(b.date).getTime()));
  return series;
};

const Stats: React.FC = () => {
  const [logs, setLogs] = useState<WorkoutLogs>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('workoutLogs') || '{}');
    setLogs(data);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';
    const series = buildSeries(logs);
    let idx = 0;
    Object.keys(series).forEach(name => {
      const canvas = document.createElement('canvas');
      containerRef.current!.appendChild(canvas);
      new Chart(canvas.getContext('2d')!, {
        type: 'line',
        data: {
          labels: series[name].map(p=>p.date),
          datasets: [{
            label: 'Weight (kg)',
            data: series[name].map(p=>p.weight),
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            tension: 0.1,
            fill: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales:{
            y:{ title:{ display:true, text:'kg'} },
            x:{ title:{ display:true, text:'Date'} }
          }
        }
      });
      idx++;
    });
  }, [logs]);

  if (Object.keys(logs).length === 0) return <p className="text-center">No logs yet.</p>;

  return (
    <Card className="p-3">
      <h5 className="mb-3">Progress Charts</h5>
      <div ref={containerRef} style={{overflowX:'auto'}}></div>
    </Card>
  );
};

export default Stats;
