import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import './App.css';

import Header from './components/Header';
import BottomNav from './components/BottomNav';

import Notification from './pages/Notification';
import Board from './pages/Board';
import Add from './pages/Add';
import Calendar from './pages/CalendarPage';
import Settings from './pages/Settings';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />

        {/* 메인 콘텐츠 영역 */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/notification" replace />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/board" element={<Board />} />
            <Route path="/add" element={<Add />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>

        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
