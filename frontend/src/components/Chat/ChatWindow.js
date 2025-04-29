import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useChat } from '../../contexts/ChatContext';
import Message from './Message';
import TypingIndicator from './TypingIndicator';

const ChatWindow = () => {
  const { messages, isTyping } = useChat();
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ChatContainer>
      {messages.length === 0 ? (
        <EmptyChat>
          <EmptyTitle>Start a conversation</EmptyTitle>
          <EmptyText>Ask me anything!</EmptyText>
        </EmptyChat>
      ) : (
        <>
          {messages.map((message) => (
            <Message key={message._id} message={message} />
          ))}
          
          {isTyping && <TypingIndicator />}
          
          <div ref={messagesEndRef} />
        </>
      )}
    </ChatContainer>
  );
};

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  gap: 1rem;
  padding-bottom: 1rem;
`;

const EmptyChat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  min-height: 200px;
  color: var(--light-text);
`;

const EmptyTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-color);
`;

const EmptyText = styled.p`
  font-size: 1.125rem;
`;

export default ChatWindow;