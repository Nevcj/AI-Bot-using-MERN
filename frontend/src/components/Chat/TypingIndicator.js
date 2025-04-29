import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FiCpu } from 'react-icons/fi';

const TypingIndicator = () => {
  return (
    <IndicatorContainer>
      <Avatar>
        <FiCpu size={18} />
      </Avatar>
      <IndicatorContent>
        <IndicatorDots>
          <Dot delay="0s" />
          <Dot delay="0.2s" />
          <Dot delay="0.4s" />
        </IndicatorDots>
      </IndicatorContent>
    </IndicatorContainer>
  );
};

const IndicatorContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 0.5rem;
`;

const Avatar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--accent-color);
  color: white;
  flex-shrink: 0;
`;

const IndicatorContent = styled.div`
  background-color: var(--ai-msg-bg);
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  border-top-left-radius: 0;
  max-width: 100px;
`;

const IndicatorDots = styled.div`
  display: flex;
  gap: 4px;
`;

const bounce = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--light-text);
  animation: ${bounce} 1s infinite;
  animation-delay: ${props => props.delay || '0s'};
`;

export default TypingIndicator;