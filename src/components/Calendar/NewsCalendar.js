import React, { useState, useEffect } from 'react';
import './NewsList.css';
import parse from 'html-react-parser';

const NewsList = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch(`https://financialmodelingprep.com/api/v3/fmp/articles?page=0&size=10&apikey=0R4rgzb9KhNddq8alCy1kyEi2pGNFN4t`);
      const data = await response.json();
      console.log(data.content); // Проверка данных в консоли
      setNews(data.content);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

 return (
    <div className="news-list-container">
      <ul className="news-list">
        {news.map((item, index) => (
          <li key={index} className="news-item">
            <img src={item.image} alt="News" className="news-image" />
            <div className="news-details">
              <h3 className="news-title">{item.title}</h3>
              <div className="news-text">{parse(item.content)}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsList;

