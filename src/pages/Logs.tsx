import React, { useEffect, useState } from 'react';
import { Table, Pagination } from 'react-bootstrap';
import { WorkoutLogs } from '../types';

const Logs: React.FC = () => {
  const [logs, setLogs] = useState<WorkoutLogs>({});
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('workoutLogs') || '{}');
    setLogs(data);
  }, []);

  if (Object.keys(logs).length === 0) return <p className="text-center">No logs recorded.</p>;

  const entries = Object.keys(logs).sort().flatMap(date => {
    return Object.keys(logs[date].exercises||{}).flatMap(name => {
      return logs[date].exercises[name].map((w,idx) => ({
        date,
        name,
        set: idx+1,
        weight: w ?? ''
      }));
    });
  });

  const pageCount = Math.ceil(entries.length / PAGE_SIZE);
  const paged = entries.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  return (
    <>
      <Table size="sm">
        <thead>
          <tr><th>Date</th><th>Exercise</th><th>Set</th><th>Weight (kg)</th></tr>
        </thead>
        <tbody>
          {paged.map((e,i) => (
            <tr key={i}>
              <td>{new Date(e.date).toLocaleDateString('en-GB')}</td>
              <td>{e.name}</td>
              <td>{e.set}</td>
              <td>{e.weight}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {pageCount > 1 && (
        <Pagination className="justify-content-center">
          <Pagination.Prev disabled={page===1} onClick={()=>setPage(p=>p-1)} />
          {Array.from({length: pageCount}).map((_,i)=>(
            <Pagination.Item key={i+1} active={i+1===page} onClick={()=>setPage(i+1)}>{i+1}</Pagination.Item>
          ))}
          <Pagination.Next disabled={page===pageCount} onClick={()=>setPage(p=>p+1)} />
        </Pagination>
      )}
    </>
  );
};

export default Logs;
