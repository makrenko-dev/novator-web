import React from 'react';
import ProfitCalculator from '../components/Calculator/ProfitCalculator.js';

const Calculator = () => {
  return (
    <div>
      <h1 style={{marginTop:'20px', marginLeft:'20px', marginBottom:'30px'}}>Калькулятор прибутку</h1>
      <ProfitCalculator />
    </div>
  );
};

export default Calculator;