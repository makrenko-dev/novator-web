import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Charts from './routes/Charts';
import Videos from './routes/Videos';
import LoginForm from './components/Login/LoginForm';
import RegistrationForm from './routes/Registration';
import Calculator from './routes/Calculator';
import Calendar from './routes/Calendar';
import Navbar from './components/Navbar/Navbar';
import VideoPage from './components/Videos/VideoPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
   const [userID, setUserID] = useState(null);
 
 useEffect(() => {
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    setLoggedIn(isLoggedIn);

    const storedUserID = localStorage.getItem('userID');
    if (isLoggedIn && storedUserID) {
      setUserID(storedUserID);
    }
  }, []);

  const handleLogin = (userID) => {
    setLoggedIn(true);
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('userID', userID);
    setUserID(userID); // Обновлено
    console.log(userID)
  };

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem('loggedIn');
    window.location.reload();
  };

  return (
    <Router>
      <div>
        <Navbar loggedIn={loggedIn} handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Charts userID={userID} />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route
            path="/videos"
            element={
                <ProtectedRoute loggedIn={loggedIn} userID={userID}>
                  <Videos userID={userID}/> {/* Передача userID в Videos */}
                </ProtectedRoute>
            }
          />
           <Route path="/videos/:id" element={<VideoPage userId={userID} />} />
        </Routes>
      </div>
    </Router>
  );
}

const ProtectedRoute = ({ loggedIn, children }) => {
  if (!loggedIn) {
    return <Navigate to="/login" />;
  }
  return children;
};

export default App;
