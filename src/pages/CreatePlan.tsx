import React, { useState, useEffect } from 'react';
import { Form, Button, Dropdown, Card, Fade } from 'react-bootstrap';
import { WorkoutPlan, Exercise, DayPlan } from '../types';

const MUSCLE_GROUPS = ['Chest','Back','Legs','Shoulders','Arms','Core','Full Body'];

const CreatePlan: React.FC = () => {
  const [day, setDay] = useState('1');
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [plan, setPlan] = useState<WorkoutPlan>(() => {
    try { return JSON.parse(localStorage.getItem('workoutPlan') || '{}'); } catch { return {}; }
  });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const existing = plan[day];
    if (existing) {
      setSelectedMuscles(existing.muscle_group.split(/,\s*/));
      setExercises(existing.exercises);
    } else {
      setSelectedMuscles([]);
      setExercises([]);
    }
  }, [day]);

  useEffect(() => {
    if (!selectedMuscles.length) {
      setError('Please choose at least one muscle group');
      return;
    }
    if (exercises.some(ex => !ex.name || ex.sets <= 0)) {
      setError('Each exercise needs a name and set count');
      return;
    }
    setError('');
  }, [selectedMuscles, exercises]);

  const updateExercise = (idx: number, field: keyof Exercise, value: any) => {
    setExercises(exs => exs.map((ex,i) => i===idx ? {...ex,[field]:value} : ex));
  };

  const addExercise = () => setExercises(exs => [...exs,{name:'',sets:0,reps:''}]);
  const removeExercise = (idx:number) => setExercises(exs => exs.filter((_,i)=>i!==idx));

  const saveDay = () => {
    if (!selectedMuscles.length || exercises.length===0) {
      setStatus('Enter a muscle group and at least one exercise.');
      return;
    }
    const dp: DayPlan = { muscle_group: selectedMuscles.join(', '), exercises };
    setPlan(p => ({...p,[day]:dp}));
    setStatus(`Saved day ${day}`);
  };

  const savePlan = () => {
    localStorage.setItem('workoutPlan', JSON.stringify({...plan,[day]:{ muscle_group: selectedMuscles.join(', '), exercises }}));
    setStatus('Plan saved!');
  };

  const toggleMuscle = (m: string) => {
    setSelectedMuscles(ms => ms.includes(m) ? ms.filter(v=>v!==m) : [...ms,m]);
  };

  return (
    <Card className="create-container p-3">
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Day</Form.Label>
          <Form.Select value={day} onChange={e=>setDay(e.target.value)} style={{maxWidth:200}}>
            <option value="1">Monday</option>
            <option value="2">Tuesday</option>
            <option value="3">Wednesday</option>
            <option value="4">Thursday</option>
            <option value="5">Friday</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Muscle Groups</Form.Label>
          <Dropdown autoClose="outside">
            <Dropdown.Toggle className="w-100" variant="outline-primary">{selectedMuscles.length ? selectedMuscles.join(', ') : 'Select Muscle Groups'}</Dropdown.Toggle>
            <Dropdown.Menu className="w-100">
              {MUSCLE_GROUPS.map(m => (
                <Dropdown.Item key={m} as="button" onClick={() => toggleMuscle(m)}>
                  <Form.Check type="checkbox" className="me-2" readOnly checked={selectedMuscles.includes(m)} label={m} />
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Form.Group>
        {exercises.map((ex,idx) => (
          <Fade in={true} appear key={idx}>
            <div className="exercise-row mb-2">
              <Form.Control value={ex.name} placeholder="Name" className="mb-1" onChange={e=>updateExercise(idx,'name',e.target.value)} />
              <Form.Control type="number" value={ex.sets} placeholder="Sets" className="mb-1" onChange={e=>updateExercise(idx,'sets',parseInt(e.target.value,10))} />
              <Form.Control value={ex.reps} placeholder="Reps" className="mb-1" onChange={e=>updateExercise(idx,'reps',e.target.value)} />
              <Form.Control type="number" value={ex.rest_sec||''} placeholder="Rest" className="mb-1" onChange={e=>updateExercise(idx,'rest_sec',parseInt(e.target.value,10))} />
              <Form.Control value={ex.superset_with||''} placeholder="Superset" className="mb-1" onChange={e=>updateExercise(idx,'superset_with',e.target.value)} />
              <Button variant="danger" size="sm" onClick={()=>removeExercise(idx)}>×</Button>
            </div>
          </Fade>
        ))}
        <Button variant="secondary" size="sm" onClick={addExercise}>Add Exercise</Button>
        <div className="mt-3">
          <Button onClick={saveDay}>Save Day</Button>
          <Button variant="success" className="ms-2" onClick={savePlan}>Save Plan</Button>
        </div>
        {status && <div className="mt-3">{status}</div>}
        {error && <div className="text-danger mt-2">{error}</div>}
      </Form>
    </Card>
  );
};

export default CreatePlan;
