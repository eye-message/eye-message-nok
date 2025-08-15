import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { FiPlusCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import '../styles/DiaryCalendar.css';

function DiaryCalendar() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const [writtenDiaryDates, setWrittenDiaryDates] = useState([]);

  // 작성된 날짜 불러오기
  useEffect(() => {
    axios
      .get('http://localhost:8080/api/diaries')
      .then((res) => {
        console.log('다이어리 목록 응답:', res.data);

        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.data)
          ? res.data.data
          : [];

        const dates = list.map((entry) => entry.diaryDate);
        setWrittenDiaryDates(dates);
      })
      .catch((err) => {
        console.error('다이어리 목록 조회 실패:', err);
      });
  }, []);

  const handleAddClick = async () => {
    const dateKey = selectedDate.toISOString().split('T')[0];
    try {
      const res = await axios.get('http://localhost:8080/api/diaries/check', {
        params: { date: dateKey },
      });
      const { mode, diaryId } = res.data;

      navigate('/diary/form', {
        state: { selectedDate, mode, diaryId },
      });
    } catch (err) {
      console.error('다이어리 작성 여부 확인 실패:', err);
    }
  };

  const handleGoToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setActiveStartDate(today);
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
              const dateKey = date.toISOString().split('T')[0];
              if (writtenDiaryDates.includes(dateKey)) {
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
