import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing user session
    const savedUser = localStorage.getItem('lexi_user');
    const guestMode = localStorage.getItem('guest_mode') === 'true';
    
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user session", e);
        localStorage.removeItem('lexi_user');
      }
    } else if (guestMode) {
      setIsGuest(true);
    }
    
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsGuest(false);
    localStorage.setItem('lexi_user', JSON.stringify(userData));
    localStorage.removeItem('guest_mode');
  };

  const handleGuestMode = () => {
    setIsGuest(true);
    localStorage.setItem('guest_mode', 'true');
  };

  const handleLogout = () => {
    setUser(null);
    setIsGuest(false);
    localStorage.removeItem('lexi_user');
    localStorage.removeItem('guest_mode');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={<LoginPage onLogin={handleLogin} onGuest={handleGuestMode} />} 
        />
        <Route 
          path="/chat" 
          element={
            user || isGuest ? (
              <ChatPage user={user} isGuest={isGuest} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route path="/" element={<Navigate to={user || isGuest ? "/chat" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App;
