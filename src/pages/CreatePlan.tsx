import React, { useState, useEffect } from 'react';
import { Form, Button, Dropdown, Card, Fade, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
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
  const [muscleError, setMuscleError] = useState('');
  const [exerciseErrors, setExerciseErrors] = useState<{name?:string;sets?:string;reps?:string;}[]>([]);
  const navigate = useNavigate();

  const hasErrors = muscleError || exerciseErrors.some(e => e.name || e.sets || e.reps);

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
    setMuscleError(selectedMuscles.length ? '' : 'Choose at least one group');
  }, [selectedMuscles]);

  useEffect(() => {
    setExerciseErrors(exercises.map(ex => ({
      name: ex.name ? '' : 'Required',
      sets: ex.sets >= 1 && ex.sets <= 5 ? '' : '1-5',
      reps: ex.reps ? '' : 'Required',
    })));
  }, [exercises]);

  const updateExercise = (idx: number, field: keyof Exercise, value: any) => {
    setExercises(exs => {
      const next = exs.map((ex,i)=> i===idx ? {...ex,[field]:value} : ex);
      setExerciseErrors(next.map(ex => ({
        name: ex.name ? '' : 'Required',
        sets: ex.sets >=1 && ex.sets <=5 ? '' : '1-5',
        reps: ex.reps ? '' : 'Required',
      })));
      return next;
    });
  };

  const addExercise = () => {
    setExercises(exs => [...exs,{name:'',sets:0,reps:''}]);
    setExerciseErrors(errs => [...errs,{name:'Required',sets:'1-5',reps:'Required'}]);
  };
  const removeExercise = (idx:number) => {
    setExercises(exs => exs.filter((_,i)=>i!==idx));
    setExerciseErrors(errs => errs.filter((_,i)=>i!==idx));
  };

  const saveDay = () => {
    if (hasErrors || !selectedMuscles.length || exercises.length===0) {
      setStatus('Fix errors before saving.');
      return;
    }
    const dp: DayPlan = { muscle_group: selectedMuscles.join(', '), exercises };
    setPlan(p => ({...p,[day]:dp}));
    setStatus(`Saved day ${day}`);
  };

  const savePlan = () => {
    if (hasErrors) return;
    localStorage.setItem('workoutPlan', JSON.stringify({...plan,[day]:{ muscle_group: selectedMuscles.join(', '), exercises }}));
    setStatus('Plan saved!');
    navigate('/');
  };

  const toggleMuscle = (m: string) => {
    setSelectedMuscles(ms => ms.includes(m) ? ms.filter(v=>v!==m) : [...ms,m]);
  };

  return (
    <Card className="create-container p-3">
      <Form>
        <Row className="g-3">
          <Col md={6}>
            <Form.Group controlId="daySelect">
              <Form.Label>Day</Form.Label>
              <Dropdown onSelect={(k)=>setDay(k||'1')}>
                <Dropdown.Toggle className="w-100" variant="outline-primary">
                  {['Monday','Tuesday','Wednesday','Thursday','Friday'][parseInt(day)-1] || 'Select Day'}
                </Dropdown.Toggle>
                <Dropdown.Menu className="w-100">
                  <Dropdown.Item eventKey="1">Monday</Dropdown.Item>
                  <Dropdown.Item eventKey="2">Tuesday</Dropdown.Item>
                  <Dropdown.Item eventKey="3">Wednesday</Dropdown.Item>
                  <Dropdown.Item eventKey="4">Thursday</Dropdown.Item>
                  <Dropdown.Item eventKey="5">Friday</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Muscle Groups</Form.Label>
              <Dropdown autoClose="outside">
                <Dropdown.Toggle className="w-100" variant="outline-primary">
                  {selectedMuscles.length ? selectedMuscles.join(', ') : 'Select Muscle Groups'}
                </Dropdown.Toggle>
                <Dropdown.Menu className="w-100">
                  {MUSCLE_GROUPS.map(m => (
                    <Dropdown.Item key={m} as="span" className="d-flex align-items-center">
                      <Form.Check
                        type="checkbox"
                        className="me-2"
                        label={m}
                        checked={selectedMuscles.includes(m)}
                        onChange={() => toggleMuscle(m)}
                      />
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
              {muscleError && <Form.Text className="text-danger">{muscleError}</Form.Text>}
            </Form.Group>
          </Col>
        </Row>
        {exercises.map((ex,idx) => (
          <Fade in={true} appear key={idx}>
            <div className="exercise-row mb-3">
              <Row className="g-2 align-items-end">
                <Col md={6}>
                  <Form.Control
                    value={ex.name}
                    placeholder="Name"
                    className="mb-1"
                    maxLength={30}
                    isInvalid={!!exerciseErrors[idx]?.name}
                    onChange={e=>updateExercise(idx,'name',e.target.value)}
                  />
                  {exerciseErrors[idx]?.name && (
                    <Form.Text className="text-danger">{exerciseErrors[idx]?.name}</Form.Text>
                  )}
                </Col>
                <Col md={6}>
                  <Form.Control
                    type="number"
                    value={ex.sets}
                    placeholder="Sets"
                    className="mb-1"
                    min={1}
                    max={5}
                    isInvalid={!!exerciseErrors[idx]?.sets}
                    onChange={e=>updateExercise(idx,'sets',parseInt(e.target.value,10))}
                  />
                  {exerciseErrors[idx]?.sets && (
                    <Form.Text className="text-danger">{exerciseErrors[idx]?.sets}</Form.Text>
                  )}
                </Col>
                <Col md={6}>
                  <Form.Control
                    value={ex.reps}
                    placeholder="Reps"
                    className="mb-1"
                    isInvalid={!!exerciseErrors[idx]?.reps}
                    onChange={e=>updateExercise(idx,'reps',e.target.value)}
                  />
                  {exerciseErrors[idx]?.reps && (
                    <Form.Text className="text-danger">{exerciseErrors[idx]?.reps}</Form.Text>
                  )}
                </Col>
                <Col md={6}>
                  <Form.Control
                    type="number"
                    value={ex.rest_sec||''}
                    placeholder="Rest"
                    className="mb-1"
                    min={0}
                    onChange={e=>updateExercise(idx,'rest_sec',parseInt(e.target.value,10))}
                  />
                </Col>
                <Col md={6}>
                  <Form.Control
                    value={ex.superset_with||''}
                    placeholder="Superset"
                    className="mb-1"
                    onChange={e=>updateExercise(idx,'superset_with',e.target.value)}
                  />
                </Col>
                <Col md="auto">
                  <Button variant="outline-danger" size="sm" onClick={()=>removeExercise(idx)}>Remove</Button>
                </Col>
              </Row>
            </div>
          </Fade>
        ))}
        <Button variant="secondary" size="sm" onClick={addExercise}>Add Exercise</Button>
        <div className="mt-3">
          <Button onClick={saveDay} disabled={hasErrors}>Save Day</Button>
          <Button variant="success" className="ms-2" onClick={savePlan} disabled={hasErrors}>Save Plan</Button>
          <Button variant="outline-secondary" className="ms-2" onClick={()=>navigate('/')}>Cancel</Button>
        </div>
        {status && <div className="mt-3">{status}</div>}
      </Form>
    </Card>
  );
};

export default CreatePlan;
