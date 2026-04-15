import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeGoogleAuth, renderGoogleButton, extractUserData } from '../services/authService';
import '../styles/LoginPage.css';

const LoginPage = ({ onLogin, onGuest }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCredentialResponse = (response) => {
      const userData = extractUserData(response.credential);
      onLogin(userData);
      navigate('/chat');
    };

    initializeGoogleAuth(handleCredentialResponse);
    renderGoogleButton('googleBtnContainer');
  }, [onLogin, navigate]);

  const handleGuestClick = () => {
    onGuest();
    navigate('/chat');
  };

  return (
    <div
      className="auth-body"
      style={{
        backgroundImage: "url('/assets/login-bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <img
              src="/assets/logo.png"
              alt="LexiVoice Logo"
              className="auth-logo"
              onError={(e) => (e.target.style.display = 'none')}
            />
            <h1 className="auth-title">LexiVoice</h1>
            <p className="auth-subtitle">Sign in for Legal Privacy</p>
          </div>

          <div
            className="auth-form"
            id="googleBtnContainer"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              marginBottom: '20px',
            }}
          >
            {/* Google button will be rendered here */}
          </div>

          <div className="auth-footer">
            <p>
              <a href="#" onClick={(e) => { e.preventDefault(); handleGuestClick(); }} className="guest-link">
                Try as Guest
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
