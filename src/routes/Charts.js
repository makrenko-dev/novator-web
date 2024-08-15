import React from 'react';
import TradingViewWidget from '../components/Charts/DrawingChart.js';

const Charts = (userID) => {
  return (
    <div>
       <h1 style={{marginTop:'20px', marginLeft:'20px', marginBottom:'30px'}}>Графіки та демо-торгівля</h1>
      <TradingViewWidget userID={userID}/>
    </div>
  );
};

export default Charts;