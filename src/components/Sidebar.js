import React, { useState } from 'react';
import '../styles/Sidebar.css';

const Sidebar = ({ user, isGuest, onLogout, onNewChat, chatHistory, onSelectChat, onDeleteChat }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleCollapse = () => {
    const nextCollapsed = !isCollapsed;
    setIsCollapsed(nextCollapsed);
    // When panel is collapsed from the bottom toggle, also close browse section.
    if (nextCollapsed) {
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const toggleBrowse = () => {
    // If collapsed, auto-open sidebar first, then open browse section.
    if (isCollapsed) {
      setIsCollapsed(false);
      setShowSearch(true);
      return;
    }
    setShowSearch(!showSearch);
  };

  const filteredChats = chatHistory.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    onLogout();
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-top-section">
        <div className="logo-wrapper">
          <img src="/assets/logo.png" alt="LexiVoice Logo" className="logo" />
          <span className="app-title">LexiVoice</span>
        </div>
      </div>

      <nav className="sidebar-menu">
        <a href="#" className="menu-item" aria-label="New Chat" onClick={(e) => { e.preventDefault(); onNewChat && onNewChat(); }}>
          <svg className="menu-icon" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
          <span className="menu-label">New Chat</span>
        </a>
        <a href="#" className="menu-item" onClick={toggleBrowse} aria-label="Browse Chats">
          <svg className="menu-icon" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
          <span className="menu-label">Browse Chats</span>
        </a>
        {showSearch && (
          <div className="browse-search-container active">
            <input
              type="text"
              placeholder="Search history..."
              className="browse-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <ul className="chat-history-list">
              {filteredChats.map((chat) => (
                <li 
                  key={chat.id} 
                  className="chat-history-item" 
                  onClick={() => onSelectChat(chat.id)} 
                  style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{chat.title}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }}
                    style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', padding: '0 5px' }}
                    title="Delete Chat"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      <div className="sidebar-toggle-section">
        <button className="sidebar-toggle" onClick={toggleCollapse} aria-label="Toggle Sidebar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round">
            {isCollapsed ? (
              <polyline points="9 6 15 12 9 18"></polyline>
            ) : (
              <polyline points="15 18 9 12 15 6"></polyline>
            )}
          </svg>
        </button>
      </div>

      <div className="user-profile">
        <img
          src={user?.picture || '/assets/avatar.svg'}
          alt="User Avatar"
          className="avatar"
        />
        <div className="user-info">
          <div className="user-name-container">
            <span className="menu-label">{user?.firstName || 'Guest'}</span>
            {!isGuest && (
              <button className="logout-icon-btn" onClick={handleLogout} title="Logout">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
