import React from 'react';
import '../styles/Header.css';

const Header = ({ isGuest, onLoginClick }) => {
  return (
    <header className="top-header">
      <div className="guest-logo-box guest-only" style={{ display: isGuest ? 'flex' : 'none' }}>
        <img src="/assets/logo.png" alt="LexiVoice" style={{ height: '32px' }} />
        <span style={{ fontWeight: 500, fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.2rem', color: 'white' }}>
          LexiVoice
        </span>
      </div>
      <span className="header-text">Lexi Voice — Speak your problem. Discover the law.</span>
      <a href="#" onClick={(e) => { e.preventDefault(); onLoginClick(); }} className="header-login-btn guest-only" style={{ display: isGuest ? 'block' : 'none' }}>Login</a>
    </header>
  );
};

export default Header;
