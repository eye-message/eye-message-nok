import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/CalendarPage.css";

function CalendarPage() {
  const { selectedDate, setSelectedDate } = useOutletContext();

  const [activeStartDate, setActiveStartDate] = useState(new Date());

  // 오늘 버튼
  const handleGoToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setActiveStartDate(today);
  };

  return (
    <div className="calendar-wrapper">
      <Calendar
        // 캘린더 기본 설정
        calendarType="gregory"
        locale="ko-KR"
        // 날짜 선택
        onChange={setSelectedDate}
        value={selectedDate}
        activeStartDate={activeStartDate}
        onActiveStartDateChange={({ activeStartDate }) =>
          setActiveStartDate(activeStartDate)
        }
        showNeighboringMonth={false}
        formatDay={(locale, date) => date.getDate()}
        tileClassName={({ date, view }) => {
          if (view === "month") {
            const diaries = JSON.parse(localStorage.getItem("diaries") || "{}");
            const dateKey = date.toISOString().split("T")[0];

            if (diaries[dateKey]) {
              return "has-diary";
            }
          }
          return null;
        }}
        // 일지 작성 여부

        tileContent={({ date, view }) => {
          if (view !== "month") return null;
          const diaries = JSON.parse(localStorage.getItem("diaries") || "{}"); // [임시] 로컬스토리지 사용 (추후 DB 연동 시 삭제 예정)
          const dateKey = date.toISOString().split("T")[0];
          if (diaries[dateKey]) {
            return <div className="dot-indicator" />;
          }
          return null;
        }}
      />

      {/* 오늘 버튼 */}
      <button className="today-button" onClick={handleGoToday}>
        오늘
      </button>
    </div>
  );
}

export default CalendarPage;
