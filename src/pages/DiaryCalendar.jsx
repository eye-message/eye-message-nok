import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { FaSmile, FaMeh, FaFrown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import '../styles/DiaryCalendar.css';
import { parseLocalDate, formatLocalDate } from '../utils/date';

function DiaryCalendar() {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState(new Date());
  const [writtenDiaryMap, setWrittenDiaryMap] = useState({});
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // 1) 세션 유저 확인
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/v1/auth/check/currentinfo`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data?.auth) {
          const id = res.data.auth.userId;
          setUserId(id);
          console.log('✅ 세션 유저 ID:', id);

          // 2) 다이어리 목록 가져오기
          return axios.get(`${import.meta.env.VITE_API_URL}/api/diaries`, {
            withCredentials: true,
          });
        } else {
          console.warn('⚠️ 로그인 안 됨');
          return null;
        }
      })
      .then((res) => {
        if (!res) return;

        const list = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.data)
          ? res.data.data
          : [];

        const map = {};
        list.forEach((entry) => {
          const dateKey = formatLocalDate(parseLocalDate(entry.diaryDate));
          map[dateKey] = entry.status;
        });

        setWrittenDiaryMap(map);
      })
      .catch((err) => {
        console.error(' 조회 실패:', err);
      });
  }, []);

  const handleAddClick = async () => {
    const dateKey = formatLocalDate(selectedDate);

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/diaries/check`,
        {
          params: { date: dateKey },
          withCredentials: true,
        }
      );

      const { mode, diaryId } = res.data;

      navigate('/diary/form', {
        state: { selectedDate, mode, diaryId },
      });
    } catch (err) {
      console.error('다이어리 작성 확인 실패:', err);
    }
  };

  const handleDateClick = async (date) => {
    const dateKey = formatLocalDate(date);
    setSelectedDate(date);

    if (writtenDiaryMap[dateKey]) {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/diaries/check`,
          {
            params: { date: dateKey },
            withCredentials: true,
          }
        );
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
        <div className="header-top">
          <div className="board-title">다이어리</div>
          <button className="add-button" onClick={handleAddClick}>
            일지 쓰기
          </button>
        </div>
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
              const status = writtenDiaryMap[dateKey];
              if (status === '좋음') return 'status-good';
              if (status === '보통') return 'status-normal';
              if (status === '나쁨') return 'status-bad';
            }
            return null;
          }}
          tileContent={({ date, view }) => {
            if (view === 'month') {
              const dateKey = formatLocalDate(date);
              const status = writtenDiaryMap[dateKey];
              if (status === '좋음') return <FaSmile className="emoji good" />;
              if (status === '보통') return <FaMeh className="emoji normal" />;
              if (status === '나쁨') return <FaFrown className="emoji bad" />;
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
