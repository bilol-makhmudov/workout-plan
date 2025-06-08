import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import CreatePlan from './pages/CreatePlan';
import LogWorkout from './pages/LogWorkout';
import Logs from './pages/Logs';
import Stats from './pages/Stats';

import 'bootstrap/dist/css/bootstrap.min.css';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}> 
          <Route index element={<Home />} />
          <Route path="create" element={<CreatePlan />} />
          <Route path="log" element={<LogWorkout />} />
          <Route path="logs" element={<Logs />} />
          <Route path="stats" element={<Stats />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
