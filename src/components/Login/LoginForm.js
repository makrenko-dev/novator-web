import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginForm.css';

const API_KEY = 'patJ1nrvWcrwSTtxH.ade66065fa96cdc72f20842a92c32c0154ee675d968965d9f7a06ebef2688667';
const BASE_ID = 'appsCCEeBBRMnVYX0';

const axiosInstance = axios.create({
  baseURL: `https://api.airtable.com/v0/${BASE_ID}`,
  headers: {
    Authorization: `Bearer ${API_KEY}`
  },
  timeout: 10000
});

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await axiosInstance.get(`/Users?filterByFormula={Username}='${username}'`);
    const users = response.data.records;

    if (users.length === 0) {
      setErrorMessage('User not found');
      return;
    }

    const user = users[0];
    if (user.fields.Password !== password) {
      setErrorMessage('Invalid password');
      return;
    }

    // Получение UID пользователя
    const userID = user.fields.UID;

    // Логин успешный
    alert('Login successful!');
    onLogin(userID); // Передача UID в функцию onLogin
    navigate('/videos'); // Перенаправление на домашнюю страницу
  } catch (error) {
    console.error('Error fetching data from Airtable:', error);
    setErrorMessage('Error logging in');
  }

  setUsername('');
  setPassword('');
};

  return (
    <>
     <h1 style={{marginTop:'20px', marginLeft:'20px', marginBottom:'30px'}}>Вхід</h1>
    <div className="login-form-container">
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="submit-button">Login</button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <p className="register-link">Don't have an account? <Link to="/register">Register</Link></p>
    </div>
    </>
  );
};

export default LoginForm;
