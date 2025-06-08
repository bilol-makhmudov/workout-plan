import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { WorkoutPlan, WorkoutLogs } from '../types';

const DAY_TO_PLAN: Record<number,string> = {0:'7',1:'1',2:'2',3:'3',4:'4',5:'5',6:'6'};

const dayIndex = (dateStr: string) => {
  const d = new Date(dateStr);
  return isNaN(d as any) ? null : d.getDay();
};

const LogWorkout: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [date, setDate] = useState('');
  const [plan, setPlan] = useState<WorkoutPlan>({});
  const [logs, setLogs] = useState<WorkoutLogs>({});

  useEffect(() => {
    setPlan(JSON.parse(localStorage.getItem('workoutPlan') || '{}'));
    setLogs(JSON.parse(localStorage.getItem('workoutLogs') || '{}'));
    const passedDay = parseInt(searchParams.get('day') || '',10);
    const initial = !isNaN(passedDay) ? nextDateForDay(passedDay) : new Date();
    setDate(initial.toISOString().split('T')[0]);
  }, []);

  const nextDateForDay = (idx:number) => {
    const d = new Date();
    while (d.getDay()!==idx) d.setDate(d.getDate()+1);
    return d;
  };

  const render = () => {
    const idx = dayIndex(date);
    if (idx===null) return [];
    const planKey = DAY_TO_PLAN[idx];
    const day = plan[planKey];
    return day? day.exercises: [];
  };

  const save = () => {
    const idx = dayIndex(date);
    if (idx===null) return;
    const exInputs = document.querySelectorAll<HTMLInputElement>('.weight-input');
    const exercises: Record<string, (number|null)[]> = {};
    exInputs.forEach(input => {
      const ex = input.dataset.ex!;
      const setNum = parseInt(input.dataset.set!,10)-1;
      if(!exercises[ex]) exercises[ex]=[];
      const val = parseFloat(input.value);
      if(!isNaN(val)) exercises[ex][setNum]=val;
    });
    const newLogs = { ...logs, [date]: { dayIndex: idx, exercises } };
    setLogs(newLogs);
    localStorage.setItem('workoutLogs', JSON.stringify(newLogs));
  };

  const highlight = searchParams.get('exercise');

  return (
    <div>
      <Form.Group className="mb-3 mt-3">
        <Form.Label>Date</Form.Label>
        <Form.Control type="date" value={date} onChange={e=>setDate(e.target.value)} />
      </Form.Group>
      {render().map(ex => (
        <div className="mb-3" key={ex.name} id={highlight===ex.name?ex.name:undefined}>
          <h5>{ex.name}</h5>
          {Array.from({length: ex.sets}).map((_,i)=>(
            <div className="input-group input-group-sm mb-1" key={i}>
              <span className="input-group-text">Set {i+1}</span>
              <Form.Control type="number" className="weight-input" data-ex={ex.name} data-set={i+1} min="0" step="0.5" />
              <span className="input-group-text">kg</span>
            </div>
          ))}
        </div>
      ))}
      <Button onClick={save}>Save Log</Button>
    </div>
  );
};

export default LogWorkout;
