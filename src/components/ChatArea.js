import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import '../styles/ChatArea.css';

const ChatArea = ({ messages, isLoading }) => {
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="chat-area">
      {messages.length === 0 ? (
        <div className="empty-state"></div>
      ) : (
        messages.map((msg, index) => (
          <MessageBubble
            key={index}
            text={msg.text}
            sender={msg.sender}
          />
        ))
      )}
      {isLoading && <MessageBubble isLoading={true} />}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ChatArea;
