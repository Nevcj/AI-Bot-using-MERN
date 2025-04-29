import React from 'react';
import styled from 'styled-components';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { useChat } from '../../contexts/ChatContext';

const Sidebar = ({ logout }) => {
  const { 
    conversations, 
    currentConversation, 
    createConversation, 
    setCurrentConversation,
    deleteConversation,
    loading 
  } = useChat();

  const handleNewChat = () => {
    createConversation();
  };

  const handleSelectConversation = (conversation) => {
    setCurrentConversation(conversation);
  };

  const handleDeleteConversation = (e, conversationId) => {
    e.stopPropagation();
    deleteConversation(conversationId);
  };

  return (
    <SidebarContainer>
      <NewChatButton onClick={handleNewChat} disabled={loading}>
        <FiPlus size={20} /> New Chat
      </NewChatButton>
      
      <ConversationsList>
        {conversations.map((conversation) => (
          <ConversationItem 
            key={conversation._id}
            active={currentConversation?._id === conversation._id}
            onClick={() => handleSelectConversation(conversation)}
          >
            <ConversationTitle>{conversation.title}</ConversationTitle>
            <DeleteButton 
              onClick={(e) => handleDeleteConversation(e, conversation._id)}
              aria-label="Delete conversation"
            >
              <FiTrash2 size={16} />
            </DeleteButton>
          </ConversationItem>
        ))}
      </ConversationsList>
      
      <SidebarFooter>
        <FooterButton onClick={logout}>Sign Out</FooterButton>
      </SidebarFooter>
    </SidebarContainer>
  );
};

const SidebarContainer = styled.div`
  width: 250px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #2D3748;
  color: white;
  padding: 1rem;
  
  @media (max-width: 768px) {
    width: 230px;
  }
  
  @media (max-width: 576px) {
    display: none;
  }
`;

const NewChatButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: 0.375rem;
  font-weight: 600;
  margin-bottom: 1rem;
  width: 100%;
  
  &:hover {
    background-color: var(--primary-dark);
  }
`;

const ConversationsList = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ConversationItem = styled.div`
  padding: 0.75rem;
  border-radius: 0.375rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const ConversationTitle = styled.div`
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
`;

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: #A0AEC0;
  opacity: 0.6;
  padding: 0.25rem;
  border-radius: 0.25rem;
  
  &:hover {
    opacity: 1;
    color: var(--danger-color);
  }
`;

const SidebarFooter = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const FooterButton = styled.button`
  background-color: transparent;
  color: #CBD5E0;
  width: 100%;
  padding: 0.625rem;
  font-size: 0.875rem;
  text-align: center;
  border-radius: 0.375rem;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

export default Sidebar;