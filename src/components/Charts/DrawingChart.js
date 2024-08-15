import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaTrash } from 'react-icons/fa';
import {
  addDataToAirtable,
  fetchDataFromAirtable,
  findUserById,
  deleteDataFromAirtable
} from '../Login/airtableAPI'; // Импортируем функции для работы с Airtable

const TradingViewWidget = ({ userID }) => {
  const containerRef = useRef(null);
  const [bets, setBets] = useState([]);
  const [expectedPrice, setExpectedPrice] = useState('');
  const [symbol, setSymbol] = useState('AAPL');
  const [userPrice, setUserPrice] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Добавляем состояние для проверки входа пользователя

  useEffect(() => {
    const createWidget = () => {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.onload = () => {
        if (window.TradingView) {
          new window.TradingView.widget({
            container_id: containerRef.current.id,
            width: '100%',
            height: '600px',
            symbol: symbol,
            interval: 'D',
            timezone: 'Etc/UTC',
            theme: 'light',
            style: '1',
            locale: 'en',
            toolbar_bg: '#f1f3f6',
            enable_publishing: false,
            allow_symbol_change: true,
            hide_side_toolbar: false,
            details: true,
            hotlist: true,
            calendar: true,
            studies: ['MACD@tv-basicstudies'],
            autosize: true
          });
        }
      };
      document.body.appendChild(script);
    };

    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      createWidget();
    }
  }, [symbol]);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const userRecord = await findUserById(userID);
        if (userRecord) {
          setIsLoggedIn(true);
          fetchBetsForUser(); // Загружаем ставки для пользователя
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking user login:', error);
        setIsLoggedIn(false);
      }
    };

    checkUserLoggedIn();
  }, [userID]);

    const fetchBetsForUser = async () => {
    try {
      const allBets = await fetchDataFromAirtable('Bets');
      console.log('ud111',userID.userID)
      const numericUserId = parseInt(userID.userID, 10); 
      console.log(numericUserId)
      const userBets = allBets.filter(bet => bet.fields.UIDN.includes(numericUserId));
      console.log(allBets)
      setBets(userBets.map(bet => ({
        id: bet.id,
        currentPrice: bet.fields.ActualP,
        direction: bet.fields.Dir,
        expectedPrice: bet.fields.BetP,
        symbol: bet.fields.Sym
      })));
    } catch (error) {
      console.error('Error fetching bets for user:', error);
    }
  };

  const handleBet = async (direction) => {
    console.log('Clicked:', direction);

    try {
      const currentPrice = parseFloat(userPrice);

      if (isNaN(currentPrice)) {
        console.error('Invalid current price');
        return;
      }

      alert(`Текущая цена актива (${symbol}) из поля ввода: ${currentPrice}`);
      console.log(`Текущая цена актива (${symbol}) из поля ввода: ${currentPrice}`);

      const userRecord = await findUserById(userID);

      if (!userRecord) {
        console.error('User record not found for userID:', userID);
        return;
      }

      const newBet = {
        ActualP: currentPrice,   // Текущая цена актива
        Dir: direction,          // Направление (buy или sell)
        BetP: parseFloat(expectedPrice),     // Ожидаемая цена актива
        Sym: symbol,             // Символ актива
        UID: [userRecord.recordId] // Ссылка на пользователя, который сделал ставку
      };

      const addedBet = await addDataToAirtable('Bets', newBet);

      setBets([...bets, {
        id: addedBet.id,
        currentPrice: newBet.ActualP,
        direction: newBet.Dir,
        expectedPrice: newBet.BetP,
        symbol: newBet.Sym
      }]);
      setExpectedPrice('');
      setUserPrice('');
    } catch (error) {
      console.error('Error handling bet:', error);
    }
  };

  const handleDeleteBet = async (betId) => {
    try {
      await deleteDataFromAirtable('Bets', betId);
      setBets(bets.filter(bet => bet.id !== betId));
    } catch (error) {
      console.error('Error deleting bet:', error);
    }
  };

  const getCurrentPriceFromAlphaVantage = async (symbol) => {
    try {
      const response = await axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=CZD7M62XLMHN85ZM`);
      const data = response.data;

      if (data && data['Global Quote'] && data['Global Quote']['05. price']) {
        return data['Global Quote']['05. price'];
      } else {
        console.error('Error fetching data from Alpha Vantage: Invalid response format');
        return null;
      }
    } catch (error) {
      console.error('Error fetching data from Alpha Vantage:', error);
      return null;
    }
  };

  return (
    <div className="container mt-5">
      <div id="tradingview_widget" ref={containerRef} style={{ width: '100%', height: '600px' }} data-symbol={symbol}></div>
      {isLoggedIn && (
        <>
          <div className="mt-4">
            <input
              type="text"
              className="form-control mb-2 mr-sm-2"
              placeholder="Символ"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
            />
            <input
              type="text"
              className="form-control mb-2 mr-sm-2"
              placeholder="Ожидаемая цена"
              value={expectedPrice}
              onChange={(e) => setExpectedPrice(e.target.value)}
            />
            <input
              type="text"
              className="form-control mb-2 mr-sm-2"
              placeholder="Текущая цена"
              value={userPrice}
              onChange={(e) => setUserPrice(e.target.value)}
            />
            <button onClick={() => handleBet('BUY')} className="btn btn-primary mr-2">Купить</button>
            <button onClick={() => handleBet('SELL')} className="btn btn-primary">Продать</button>
          </div>
          <table className="table mt-4">
            <thead>
              <tr>
                <th>Текущая цена</th>
                <th>Направление</th>
                <th>Ожидаемая цена</th>
                <th>Символ</th>
                <th>Действие</th>
              </tr>
            </thead>
            <tbody>
              {bets.map((bet, index) => (
                <tr key={index}>
                  <td>{bet.currentPrice}</td>
                  <td>{bet.direction}</td>
                  <td>{bet.expectedPrice}</td>
                  <td>{bet.symbol}</td>
                  <td>
                    <button onClick={() => handleDeleteBet(bet.id)} className="btn btn-danger">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default TradingViewWidget;
