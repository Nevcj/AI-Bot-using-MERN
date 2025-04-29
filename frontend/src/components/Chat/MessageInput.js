import React, { useState } from 'react';
import styled from 'styled-components';
import { FiSend } from 'react-icons/fi';
import { useChat } from '../../contexts/ChatContext';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const { sendMessage, isTyping, loading } = useChat();

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    sendMessage(message.trim());
    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <InputForm onSubmit={handleSendMessage}>
      <TextArea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Type a message..."
        disabled={isTyping || loading}
        rows={1}
      />
      <SendButton 
        type="submit" 
        disabled={!message.trim() || isTyping || loading}
      >
        <FiSend size={20} />
      </SendButton>
    </InputForm>
  );
};

const InputForm = styled.form`
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
`;

const TextArea = styled.textarea`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 1.5rem;
  resize: none;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
  max-height: 150px;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(94, 114, 228, 0.3);
  }
  
  &:disabled {
    background-color: #F9FAFB;
    cursor: not-allowed;
  }
`;

const SendButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 50%;
  padding: 0;
  
  &:hover:not(:disabled) {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: #CBD5E0;
    cursor: not-allowed;
  }
`;

export default MessageInput;