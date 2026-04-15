import React from 'react';
import '../styles/MessageBubble.css';

const IMPORTANT_TERMS_REGEX = /\b(FIR|IPC|CrPC|Article\s+\d+[A-Za-z]?|Section\s+\d+[A-Za-z]?|Constitution|Supreme Court|High Court|legal notice|complaint|petition|bail|arrest|evidence|documents|rights|remedy|relief|police station|cyber cell|consumer forum)\b/gi;

const formatBotResponse = (text = '') => {
  const lines = text.split('\n');

  return lines.map((line, lineIdx) => {
    // Also highlight heading-like statements ending with ":".
    const headingMatch = line.match(/^([\w\s()/-]{3,}:\s*)(.*)$/);
    const headingPrefix = headingMatch ? headingMatch[1] : '';
    const content = headingMatch ? headingMatch[2] : line;

    const parts = content.split(IMPORTANT_TERMS_REGEX);
    const rendered = parts.map((part, idx) => {
      if (part && IMPORTANT_TERMS_REGEX.test(part)) {
        IMPORTANT_TERMS_REGEX.lastIndex = 0;
        return <strong key={`s-${lineIdx}-${idx}`}>{part}</strong>;
      }
      IMPORTANT_TERMS_REGEX.lastIndex = 0;
      return <React.Fragment key={`t-${lineIdx}-${idx}`}>{part}</React.Fragment>;
    });

    return (
      <React.Fragment key={`line-${lineIdx}`}>
        {headingPrefix ? <strong>{headingPrefix}</strong> : null}
        {rendered}
        {lineIdx < lines.length - 1 ? <br /> : null}
      </React.Fragment>
    );
  });
};

const MessageBubble = ({ text, sender, isLoading }) => {
  if (isLoading) {
    return (
      <div className="message-wrapper bot loading-indicator">
        <div className="typing-indicator">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
    );
  }

  return (
    <div className={`message-wrapper ${sender}`}>
      <div className="message-bubble">
        {sender === 'bot' ? formatBotResponse(text) : text}
      </div>
    </div>
  );
};

export default MessageBubble;
