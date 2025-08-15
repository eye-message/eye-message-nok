import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Layout from './pages/Layout';
import Notification from './pages/Notification';
import Board from './pages/Board';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MessageAddForm from './pages/MessageAddForm';
import MessageList from './pages/MessageList';
import DiaryCalendar from './pages/DiaryCalendar';
import DiaryMain from './pages/DiaryMain';
import DiaryForm from './pages/DiaryForm';

import './styles/App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<Layout />}>
          {/* <Route index element={<Navigate to="/notification" replace />} /> */}
          <Route path="/notification" element={<Notification />} />
          <Route path="/board" element={<Board />} />
          <Route path="/list" element={<MessageList />} />
          <Route path="/add" element={<MessageAddForm />} />
          <Route path="/diary" element={<DiaryMain />}>
            <Route index element={<DiaryCalendar />} />

            <Route path="form" element={<DiaryForm />} />
          </Route>
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
