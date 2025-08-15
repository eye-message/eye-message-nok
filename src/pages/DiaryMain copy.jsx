import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

function DiaryMain() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <>
      {/* <Header selectedDate={selectedDate} /> */}
      <Outlet context={{ selectedDate, setSelectedDate }} />
    </>
  );
}

export default DiaryMain;
