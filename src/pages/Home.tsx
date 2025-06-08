import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { WorkoutPlan, Exercise } from '../types';

const DAY_TO_PLAN: Record<number, string> = {
  0: '7',
  1: '1',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
};

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

const Home: React.FC = () => {
  const [currentDay, setCurrentDay] = useState(() => new Date().getDay());
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('workoutPlan');
    if (saved) {
      try { setPlan(JSON.parse(saved)); } catch { setPlan(null); }
    }
  }, []);

  const renderExercises = (exs: Exercise[]) => (
    <Row xs={1} md={2} className="g-3">
      {exs.map((ex,i) => (
        <Col key={i}>
          <Card onClick={() => navigate(`/log?day=${currentDay}&exercise=${encodeURIComponent(ex.name)}`)} style={{cursor:'pointer'}}>
            <Card.Body>
              <Card.Title>{ex.name}</Card.Title>
              <div>{ex.sets}×{ex.reps}</div>
              {ex.rest_sec && <div>Rest {ex.rest_sec}s</div>}
              {ex.superset_with && <div>Superset: {ex.superset_with}</div>}
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );

  const planKey = DAY_TO_PLAN[currentDay];
  const dayName = DAYS[currentDay];
  const dayPlan = plan && plan[planKey];

  return (
    <div className="text-center">
      <h2 className="mb-3">{dayName}'s Workout</h2>
      {dayPlan ? (
        <>
          <p>Target: {dayPlan.muscle_group}</p>
          {renderExercises(dayPlan.exercises)}
        </>
      ) : (
        <p>No workout plan found. <Button variant="link" onClick={() => navigate('/create')}>Create one</Button></p>
      )}
      <div className="mt-4">
        <Button className="me-2" onClick={() => setCurrentDay((currentDay+6)%7)}>Prev</Button>
        <Button onClick={() => setCurrentDay((currentDay+1)%7)}>Next</Button>
      </div>
    </div>
  );
};

export default Home;
