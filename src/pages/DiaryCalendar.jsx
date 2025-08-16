import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { FiPlusCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import '../styles/DiaryCalendar.css';
import { parseLocalDate, formatLocalDate } from '../utils/date';

function DiaryCalendar() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const [writtenDiaryDates, setWrittenDiaryDates] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/diaries')
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.data)
          ? res.data.data
          : [];

        const dates = list.map((entry) =>
          formatLocalDate(parseLocalDate(entry.diaryDate))
        );

        setWrittenDiaryDates(dates);
      })
      .catch((err) => {
        console.error('다이어리 목록 조회 실패:', err);
      });
  }, []);

  const handleAddClick = async () => {
    const dateKey = formatLocalDate(selectedDate);

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

  const handleDateClick = async (date) => {
    const dateKey = formatLocalDate(date); // YYYY-MM-DD 문자열로 변환
    setSelectedDate(date);

    if (writtenDiaryDates.includes(dateKey)) {
      // 이미 작성된 일지 → 상세 보기로 이동
      try {
        const res = await axios.get('http://localhost:8080/api/diaries/check', {
          params: { date: dateKey },
        });
        const { diaryId } = res.data;

        navigate('/diary/detail', {
          state: { selectedDate: date, diaryId },
        });
      } catch (err) {
        console.error('상세 페이지 이동 실패:', err);
      }
    }
  };

  const handleGoToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setActiveStartDate(today);
  };

  return (
    <div className="diary-calendar-wrapper">
      <div className="calendar-header">
        <button className="add-button" onClick={handleAddClick}>
          <FiPlusCircle size={24} />
        </button>
      </div>

      <div className="calendar-wrapper">
        <Calendar
          calendarType="gregory"
          locale="ko-KR"
          onChange={handleDateClick}
          value={selectedDate}
          activeStartDate={activeStartDate}
          onActiveStartDateChange={({ activeStartDate }) =>
            setActiveStartDate(activeStartDate)
          }
          showNeighboringMonth={false}
          formatDay={(locale, date) => date.getDate()}
          tileClassName={({ date, view }) => {
            if (view === 'month') {
              const dateKey = formatLocalDate(date);
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
