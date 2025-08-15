import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { FiPlusCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';
import '../styles/DiaryCalendar.css';

function DiaryCalendar() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState(new Date());

  const handleGoToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setActiveStartDate(today);
  };

  const handleAddClick = () => {
    const dateKey = selectedDate.toISOString().split('T')[0];
    const diaries = JSON.parse(localStorage.getItem('diaries') || '{}');
    const mode = diaries[dateKey] ? 'edit' : 'create';

    navigate('/diary/form', {
      state: { selectedDate, mode },
    });
  };

  return (
    <div className="diary-calendar-wrapper">
      {/* 🔹 상단 헤더바 (+ 버튼만 있음) */}
      <div className="calendar-header">
        <button className="add-button" onClick={handleAddClick}>
          <FiPlusCircle size={24} />
        </button>
      </div>

      {/* 📅 캘린더 */}
      <div className="calendar-wrapper">
        <Calendar
          calendarType="gregory"
          locale="ko-KR"
          onChange={setSelectedDate}
          value={selectedDate}
          activeStartDate={activeStartDate}
          onActiveStartDateChange={({ activeStartDate }) =>
            setActiveStartDate(activeStartDate)
          }
          showNeighboringMonth={false}
          formatDay={(locale, date) => date.getDate()}
          tileClassName={({ date, view }) => {
            if (view === 'month') {
              const diaries = JSON.parse(
                localStorage.getItem('diaries') || '{}'
              );
              const dateKey = date.toISOString().split('T')[0];
              if (diaries[dateKey]) {
                return 'has-diary';
              }
            }
            return null;
          }}
        />
        <button className="today-button" onClick={handleGoToday}>
          오늘
        </button>
      </div>
    </div>
  );
}

export default DiaryCalendar;
