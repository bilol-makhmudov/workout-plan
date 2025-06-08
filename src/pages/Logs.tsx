import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { WorkoutLogs } from '../types';

const Logs: React.FC = () => {
  const [logs, setLogs] = useState<WorkoutLogs>({});

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('workoutLogs') || '{}');
    setLogs(data);
  }, []);

  if (Object.keys(logs).length === 0) return <p className="text-center">No logs recorded.</p>;

  return (
    <Table size="sm">
      <thead>
        <tr><th>Date</th><th>Exercise</th><th>Set</th><th>Weight (kg)</th></tr>
      </thead>
      <tbody>
        {Object.keys(logs).sort().map(date => (
          Object.keys(logs[date].exercises||{}).map(name => (
            logs[date].exercises[name].map((w,idx) => (
              <tr key={`${date}-${name}-${idx}`}> 
                <td>{date}</td>
                <td>{name}</td>
                <td>{idx+1}</td>
                <td>{w ?? ''}</td>
              </tr>
            ))
          ))
        ))}
      </tbody>
    </Table>
  );
};

export default Logs;
