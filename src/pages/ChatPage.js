import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ChatArea from '../components/ChatArea';
import InputArea from '../components/InputArea';
import { chatService } from '../services/apiService';
import { speakText, stopSpeaking } from '../services/speechService';
import '../styles/ChatPage.css';

const ChatPage = ({ user, isGuest, onLogout }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVoxMode, setIsVoxMode] = useState(false);
  const activeRequestRef = useRef(null);
  const stopRequestedRef = useRef(false);

  const generateChatTitle = useCallback((chatMessages) => {
    if (!chatMessages || chatMessages.length === 0) return 'New chat';

    const firstBot = chatMessages.find((m) => m.sender === 'bot' && m.text && m.text.trim());
    const firstUser = chatMessages.find((m) => m.sender === 'user' && m.text && m.text.trim());
    const sourceText = (firstBot?.text || firstUser?.text || '').trim();

    if (!sourceText) return 'New chat';

    // Clean common formatting before making a compact title.
    const cleaned = sourceText
      .replace(/\*\*/g, '')
      .replace(/^\s*\d+\)\s*/gm, '')
      .replace(/^\s*[-*]\s*/gm, '')
      .replace(/\s+/g, ' ')
      .trim();

    const firstSentence = cleaned.split(/[.!?]/)[0]?.trim() || cleaned;
    const compact = firstSentence.length > 48
      ? `${firstSentence.substring(0, 48).trim()}...`
      : firstSentence;

    return compact || 'New chat';
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('lexi_chat_history');
    if (saved) {
      try { setChatHistory(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      if (!currentSessionId) {
        setCurrentSessionId(Date.now().toString());
      } else {
        setChatHistory(prev => {
          let history = [...prev];
          const existingIdx = history.findIndex(h => h.id === currentSessionId);
          if (existingIdx >= 0) {
            history[existingIdx] = { ...history[existingIdx], messages, updatedAt: Date.now() };
          } else {
            history.unshift({
              id: currentSessionId,
              title: generateChatTitle(messages),
              messages,
              updatedAt: Date.now()
            });
          }
          localStorage.setItem('lexi_chat_history', JSON.stringify(history));
          return history;
        });
      }
    }
  }, [messages, currentSessionId, generateChatTitle]);

  const handleSubmit = useCallback(async (text) => {
    if (!text.trim() || isLoading) return;

    // Stop any ongoing speech before processing new input
    stopSpeaking();

    // Add user message
    setMessages((prevMessages) => [
      ...prevMessages,
      { text, sender: 'user' },
    ]);

    setIsLoading(true);
    stopRequestedRef.current = false;
    const controller = new AbortController();
    activeRequestRef.current = controller;

    try {
      const response = await chatService.sendMessage(text, controller.signal);
      const answerText = response.answer;
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: answerText, sender: 'bot' },
      ]);

      // If Vox Mode is on, speak the response aloud
      if (isVoxMode) {
        speakText(answerText);
      }
    } catch (error) {
      // Request was intentionally stopped by user
      if (stopRequestedRef.current || error?.code === 'ERR_CANCELED' || error?.name === 'CanceledError') {
        return;
      }
      console.error('Error:', error);
      const errMsg = "I'm having trouble connecting to my legal brain.";
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: errMsg, sender: 'bot' },
      ]);
      if (isVoxMode) {
        speakText(errMsg);
      }
    } finally {
      activeRequestRef.current = null;
      setIsLoading(false);
    }
  }, [isLoading, isVoxMode]);

  const handleStopResponse = useCallback(() => {
    stopRequestedRef.current = true;
    stopSpeaking();
    if (activeRequestRef.current) {
      activeRequestRef.current.abort();
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleNewChat = () => {
    handleStopResponse();
    stopSpeaking();
    setMessages([]);
    setCurrentSessionId(null);
  };

  const handleSelectChat = (id) => {
    const selected = chatHistory.find(c => c.id === id);
    if (selected) {
      setMessages(selected.messages);
      setCurrentSessionId(selected.id);
    }
  };

  const handleDeleteChat = (id) => {
    setChatHistory(prev => {
      const newHistory = prev.filter(c => c.id !== id);
      localStorage.setItem('lexi_chat_history', JSON.stringify(newHistory));
      return newHistory;
    });

    if (currentSessionId === id) {
      setMessages([]);
      setCurrentSessionId(null);
    }
  };

  return (
    <div className={`app-container ${isGuest ? 'guest-mode' : ''}`}>
      <Sidebar 
        user={user} 
        isGuest={isGuest} 
        onLogout={handleLogout} 
        onNewChat={handleNewChat} 
        chatHistory={chatHistory} 
        onSelectChat={handleSelectChat} 
        onDeleteChat={handleDeleteChat}
      />
      <div className="right-content">
        <Header isGuest={isGuest} onLoginClick={handleLoginClick} />
        <main className={`main-content ${messages.length > 0 ? 'chat-mode' : ''} ${isVoxMode ? 'vox-mode' : ''}`}>
          {messages.length > 0 && <ChatArea messages={messages} isLoading={isLoading} />}
          {messages.length === 0 && (
            <div className="center-content-wrapper">
              <h1 className="greeting-title">
                {isVoxMode ? 'Lexi Assist is ready to listen' : 'Better ask Lexi !'}
              </h1>
              <InputArea
                onSubmit={handleSubmit}
                isLoading={isLoading}
                isVoxMode={isVoxMode}
                setIsVoxMode={setIsVoxMode}
                hasMessages={false}
                isGuest={isGuest}
                onStop={handleStopResponse}
              />
            </div>
          )}
          {messages.length > 0 && (
            <div className="input-area-bottom">
              <InputArea
                onSubmit={handleSubmit}
                isLoading={isLoading}
                isVoxMode={isVoxMode}
                setIsVoxMode={setIsVoxMode}
                hasMessages={true}
                isGuest={isGuest}
                onStop={handleStopResponse}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ChatPage;
