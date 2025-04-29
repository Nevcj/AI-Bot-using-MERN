import React from 'react';
import styled from 'styled-components';
import { FiUser, FiCpu } from 'react-icons/fi';

const Message = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <MessageContainer isUser={isUser}>
      <Avatar isUser={isUser}>
        {isUser ? <FiUser size={18} /> : <FiCpu size={18} />}
      </Avatar>
      <MessageContent isUser={isUser}>
        <MessageText>{message.content}</MessageText>
        <MessageTime>
          {new Date(message.createdAt).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </MessageTime>
      </MessageContent>
    </MessageContainer>
  );
};

const MessageContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  max-width: 100%;
  margin-bottom: 0.5rem;
`;

const Avatar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${props => 
    props.isUser ? 'var(--primary-light)' : 'var(--accent-color)'};
  color: white;
  flex-shrink: 0;
`;

const MessageContent = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${props => 
    props.isUser ? 'var(--user-msg-bg)' : 'var(--ai-msg-bg)'};
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  border-top-left-radius: ${props => (props.isUser ? '1rem' : '0')};
  border-top-right-radius: ${props => (props.isUser ? '0' : '1rem')};
  max-width: 85%;
  position: relative;
`;

const MessageText = styled.div`
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.5;
`;

const MessageTime = styled.div`
  font-size: 0.75rem;
  color: var(--light-text);
  align-self: flex-end;
  margin-top: 0.25rem;
`;

export default Message;