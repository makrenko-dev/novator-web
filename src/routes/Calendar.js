import React from 'react';
import NewsCalendar from '../components/Calendar/NewsCalendar.js';

const Calendar = () => {
  return (
    <div>
      <h1 style={{marginTop:'20px', marginLeft:'20px', marginBottom:'30px'}}>Новини</h1>
      <NewsCalendar />
    </div>
  );
};

export default Calendar;