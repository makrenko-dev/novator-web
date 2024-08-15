import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './RegistrationForm.css';
import { createUserInUsersTable, createUserProgressRecord } from './airtableAPI'; // Імпорт функцій для взаємодії з Airtable API

const RegistrationForm = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');
  const [role, setRole] = useState('');
  const [age, setAge] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const newUser = await createUserInUsersTable({ Name: name, UserName: username, Password: password, Country: country, Role: role, Age: age, PhoneNumber: phoneNumber });
      await createUserProgressRecord(newUser.id); // Передаємо ідентифікатор новоствореного користувача
      alert('Реєстрація успішна!');
      setName('');
      setUsername('');
      setPassword('');
      setCountry('');
      setRole('');
      setAge('');
      setPhoneNumber('');
    } catch (error) {
      console.error('Error registering user:', error);
      setErrorMessage('Помилка реєстрації користувача. Спробуйте ще раз.');
    }
  };

  return (
    <div className="registration-form-container">
      <form onSubmit={handleRegister}>
        <div className="form-group">
          <label htmlFor="name">Ім'я:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="username">Email:</label>
          <input
            type="email"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Пароль:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="country">Країна:</label>
          <input
            type="text"
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="role">Роль:</label>
          <select id="role" value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="">Оберіть роль</option>
            <option value="Студент">Студент</option>
            <option value="Фрілансер">Фрілансер</option>
            <option value="Офісний працівник">Офісний працівник</option>
            <option value="Підприємець">Підприємець</option>
            <option value="Не працюю та не навчаюся">Не працюю та не навчаюся</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="age">Вік:</label>
          <select id="age" value={age} onChange={(e) => setAge(e.target.value)} required>
            <option value="">Оберіть вік</option>
            <option value="18-25">18-25</option>
            <option value="25-35">25-35</option>
            <option value="35-45">35-45</option>
            <option value="50-60">50-60</option>
            <option value="60+">60+</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Номер телефону:</label>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            placeholder="+380500011212"
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">Зареєструватися</button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <p className="login-link">Вже є обліковий запис? <Link to="/login">Увійти</Link></p>
    </div>
  );
};

export default RegistrationForm;
