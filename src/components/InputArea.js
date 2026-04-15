import React, { useState, useRef, useEffect } from 'react';
import { useSpeechRecognition, startListening } from '../services/speechService';
import '../styles/InputArea.css';

const InputArea = ({ onSubmit, onStop, isLoading, isVoxMode, setIsVoxMode, hasMessages, isGuest }) => {
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const recognition = useSpeechRecognition();
  const plusMenuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (plusMenuRef.current && !plusMenuRef.current.contains(e.target)) {
        setShowPlusMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const submitBtnRef = React.useRef(null);

  const resetListeningState = () => {
    setIsListening(false);
    if (submitBtnRef.current) {
      submitBtnRef.current.classList.remove('recording');
    }
  };

  const handleSubmitClick = () => {
    if (isLoading) {
      if (onStop) onStop();
      return;
    }

    if (isVoxMode) {
      if (!isListening) {
        setIsListening(true);
        if (submitBtnRef.current) {
          submitBtnRef.current.classList.add('recording');
        }
        startListening(recognition, (transcript) => {
          resetListeningState();
          onSubmit(transcript);
        }, (error) => {
          resetListeningState();
          console.error('Speech recognition error:', error);
        }, () => {
          // Some browsers may end without a transcript.
          resetListeningState();
        });
      }
    } else {
      const text = inputValue.trim();
      if (text) {
        onSubmit(text);
        setInputValue('');
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isVoxMode) {
      handleSubmitClick();
    }
  };

  const toggleVoxMode = () => {
    resetListeningState();
    setIsVoxMode(!isVoxMode);
  };

  return (
    <div className="input-area">
      <div className="search-bar">
        <div className="plus-button-wrapper" ref={plusMenuRef}>
          <button
            className={`plus-button ${showPlusMenu ? 'active' : ''}`}
            aria-label="More options"
            disabled={isLoading}
            onClick={() => setShowPlusMenu((prev) => !prev)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          {showPlusMenu && (
            <div className="plus-menu" role="menu">
              {/* LexiVoice 2.0 – coming soon */}
              <div className="plus-menu-item coming-soon" role="menuitem">
                <span className="plus-menu-icon">🎙️</span>
                <span className="plus-menu-label">LexiVoice 2.0</span>
                <span className="plus-menu-badge">soon</span>
              </div>

              {/* Vox Mode toggle — only inside the menu during an active chat */}
              {hasMessages && !isGuest && (
                <div
                  className="plus-menu-item vox-toggle"
                  role="menuitem"
                  onClick={() => {
                    toggleVoxMode();
                    setShowPlusMenu(false);
                  }}
                >
                  <span className="plus-menu-icon">{isVoxMode ? '💬' : '🎤'}</span>
                  <span className="plus-menu-label">
                    {isVoxMode ? 'Switch to Chat' : 'Switch to Vox Mode'}
                  </span>
                  {isVoxMode && <span className="plus-menu-badge active-badge">active</span>}
                </div>
              )}
            </div>
          )}
        </div>
        <input
          type="text"
          placeholder="what's concerning you?"
          aria-label="Chat Input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isVoxMode || isLoading}
        />
        <button
          className={`submit-button ${isListening ? 'recording' : ''} ${isLoading ? 'stop-mode' : ''}`}
          onClick={handleSubmitClick}
          aria-label={isLoading ? "Stop" : "Send message"}
          ref={submitBtnRef}
          disabled={false}
        >
          {isLoading ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#FFFFFF" stroke="none">
              <path d="M17 6.1H7c-.5 0-.9.4-.9.9v10c0 .5.4.9.9.9h10c.5 0 .9-.4.9-.9V7c0-.5-.4-.9-.9-.9z"></path>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF"
              strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              {isVoxMode ? (
                <>
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="23"></line>
                  <line x1="8" y1="23" x2="16" y2="23"></line>
                </>
              ) : (
                <>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </>
              )}
            </svg>
          )}
        </button>
      </div>

      {/* Vox mode switch — shown initially and as "back to chat" while Vox is active */}
      {!isGuest && (!hasMessages || isVoxMode) && (
        <div className="mode-switch" onClick={toggleVoxMode}>
          {isVoxMode ? (
            <>Back to <span className="vox-badge">Chat</span></>
          ) : (
            <>Switch to <span className="vox-badge">Vox Mode</span></>
          )}
        </div>
      )}
    </div>
  );
};

export default InputArea;
