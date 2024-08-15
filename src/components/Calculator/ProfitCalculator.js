import React, { useState } from 'react';
import { Alert } from 'react-bootstrap'; // Імпортуємо Alert з React Bootstrap
import './ProfitCalculator.css';

const ProfitCalculator = () => {
  const [investment, setInvestment] = useState('');
  const [investmentType, setInvestmentType] = useState('Криптовалюта');
  const [investmentTerm, setInvestmentTerm] = useState('6');
  const [investmentRisk, setInvestmentRisk] = useState('Низький');
  const [result, setResult] = useState(null);
  const [totalPercentage, setTotalPercentage] = useState(null);
  const [investmentDetails, setInvestmentDetails] = useState(null);
  const [error, setError] = useState(false); // Стан для відображення помилки

  const handleCalculate = () => {
    if (!investment) {
      setError(true); // Показати помилку, якщо сума інвестицій порожня
      return; // Перервати функцію, якщо сума інвестицій порожня
    }
    
    const investmentAmount = parseFloat(investment);
    let profitPercentage = 0;

    // Визначення відсотка прибутку в залежності від типу інвестиції
    switch (investmentType) {
      case 'Криптовалюта':
        profitPercentage += 5;
        break;
      case 'Акції':
        profitPercentage += 7;
        break;
      case 'Форекс':
        profitPercentage += 10;
        break;
      default:
        break;
    }

    // Додаткові відсотки в залежності від строку інвестиції
    const termBonus = {
      '6': 0,
      '12': 1,
      '18': 2,
      '24': 3
    };

    profitPercentage += termBonus[investmentTerm];

    // Додаткові відсотки в залежності від рівня ризику
    const riskBonus = {
      'Низький': 0,
      'Середній': 2,
      'Високий': 5
    };

    profitPercentage += riskBonus[investmentRisk];

    // Обчислення прибутку за складним відсотком
    const result = calculateCompoundInterest(investmentAmount, profitPercentage, investmentTerm);
    setResult(result);

    // Збереження параметрів інвестиції
    const details = {
      'Тип інвестиції': investmentType,
      'Сума інвестиції': investmentAmount,
      'Термін інвестиції': `${investmentTerm} місяців`,
      'Ризик інвестиції': investmentRisk,
      'Прибуток': result
    };
    setInvestmentDetails(details);

    // Обчислення загального відсотка
    const totalPercentage = profitPercentage;
    setTotalPercentage(totalPercentage);
     setError(false);
  };

  const calculateCompoundInterest = (principal, rate, time) => {
    const n = 1; // Припускається, що відсоток нараховується один раз на рік
    const amount = principal * Math.pow(1 + rate / (n * 100), n * time);
    return (amount - principal).toFixed(2); // Округлюємо до двох знаків після коми
  };

  return (
    <div className="profit-calculator-container">
    
       {error && <Alert variant="danger">Будь ласка, введіть суму інвестицій</Alert>}
      <div className="input-group">
        <label>Тип інвестиції:</label>
        <select className="select-input" value={investmentType} onChange={(e) => setInvestmentType(e.target.value)}>
          <option value="Криптовалюта">Криптовалюта</option>
          <option value="Акції">Акції</option>
          <option value="Форекс">Форекс</option>
        </select>
      </div>
      <div className="input-group">
        <label>Сума інвестиції($):</label>
        <input
          type="number"
          className="text-input"
          value={investment}
          onChange={(e) => setInvestment(e.target.value)}
          placeholder="Сума інвестиціії"
        />
      </div>
      <div className="input-group">
        <label>Термін інвестиції:</label>
        <select className="select-input" value={investmentTerm} onChange={(e) => setInvestmentTerm(e.target.value)}>
          <option value="6">6 місяців</option>
          <option value="12">12 місяців</option>
          <option value="18">18 місяців</option>
          <option value="24">24 місяці</option>
          </select>
      </div>
      <div className="input-group">
        <label>Ризик інвестиції:</label>
        <select className="select-input" value={investmentRisk} onChange={(e) => setInvestmentRisk(e.target.value)}>
        <option value="Низький">Низький</option>
        <option value="Середній">Середній</option>
        <option value="Високий">Високий</option>
        </select>
      </div>
      <button className="calculate-button" onClick={handleCalculate}>Розрахувати</button>
      {totalPercentage !== null && <p className="result-text">Загальний відсоток: {totalPercentage}%</p>}
      {result !== null && <p className="result-text">Прибуток: {result}</p>}
      {investmentDetails && (
      <div>
        <h3 className="details-header">Деталі інвестиції</h3>
        <ul className="details-list">
        {Object.entries(investmentDetails).map(([key, value]) => (
        <li key={key} className="details-item">
        <strong>{key}:</strong> {value}
        </li>
        ))}
        </ul>
      </div>
    )}
  </div>
  );
};

export default ProfitCalculator;