import React from 'react';
import styled from 'styled-components';
import { useChat } from '../../contexts/ChatContext';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import MessageInput from './MessageInput';

const ChatInterface = () => {
  const { user, logout } = useAuth();
  const { currentConversation, loading } = useChat();

  return (
    <ChatContainer>
      <Sidebar logout={logout} />
      
      <MainContent>
        <ChatHeader>
          <HeaderTitle>
            {currentConversation ? currentConversation.title : 'New Chat'}
          </HeaderTitle>
          <UserInfo>
            <UserName>{user?.username}</UserName>
            <LogoutButton onClick={logout}>Logout</LogoutButton>
          </UserInfo>
        </ChatHeader>
        
        <ChatContent>
          {loading ? (
            <LoadingMessage>Loading...</LoadingMessage>
          ) : (
            <ChatWindow />
          )}
        </ChatContent>
        
        <InputContainer>
          <MessageInput />
        </InputContainer>
      </MainContent>
    </ChatContainer>
  );
};

const ChatContainer = styled.div`
  display: flex;
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

const ChatHeader = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--bg-color);
`;

const HeaderTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
`;

const UserName = styled.span`
  font-weight: 500;
  margin-right: 1rem;
`;

const LogoutButton = styled.button`
  background-color: transparent;
  color: var(--danger-color);
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ChatContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background-color: var(--chat-bg);
`;

const InputContainer = styled.div`
  padding: 1rem;
  border-top: 1px solid var(--border-color);
  background-color: var(--bg-color);
`;

const LoadingMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: var(--light-text);
  font-size: 1.125rem;
`;

export default ChatInterface;