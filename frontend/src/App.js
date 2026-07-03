// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Profile from './components/Profile';
import Home from './components/Home';
import Navbar from './components/navbar';
import AddProblem from './components/AddProblem';
import Footer from './components/Footer';
import Analytics from './components/Analytics';
import SolvedHistory from './components/SolvedHistory';
import { installExtensionAuthResponder, publishExtensionAuth } from './extensionAuth';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    if (token) {
      publishExtensionAuth(token);
    }
    return installExtensionAuthResponder();
  }, []);

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <div className="app-wrapper">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home isLoggedIn={isLoggedIn} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/history" element={<SolvedHistory />} />
          <Route path="/add" element={<AddProblem />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="*" element={<Navigate to={isLoggedIn ? '/profile' : '/home'} replace />} />
        </Routes>
      </div>

      <Footer />
    </Router>
  );
}

export default App;
