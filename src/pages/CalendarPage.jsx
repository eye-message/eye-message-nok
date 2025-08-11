import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/CalendarPage.css";

function CalendarPage() {
  const [value, setValue] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState(new Date());

  const handleGoToday = () => {
    const today = new Date();
    setValue(today);
    setActiveStartDate(today); // ✅ 오늘이 포함된 월로 이동
  };

  return (
    <div className="calendar-wrapper">
      <Calendar
        onChange={setValue}
        value={value}
        activeStartDate={activeStartDate}
        onActiveStartDateChange={({ activeStartDate }) =>
          setActiveStartDate(activeStartDate)
        }
        showNeighboringMonth={false}
        formatDay={(locale, date) => date.getDate()}
      />

      <button className="today-button" onClick={handleGoToday}>
        오늘
      </button>
    </div>
  );
}

export default CalendarPage;
