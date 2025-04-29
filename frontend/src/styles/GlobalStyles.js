import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    --primary-color: #5E72E4;
    --primary-light: #7B8FF2;
    --primary-dark: #324EB8;
    --secondary-color: #F7FAFC;
    --text-color: #2D3748;
    --light-text: #718096;
    --accent-color: #38B2AC;
    --danger-color: #E53E3E;
    --border-color: #E2E8F0;
    --bg-color: #FFFFFF;
    --chat-bg: #F7FAFC;
    --user-msg-bg: #EBF4FF;
    --ai-msg-bg: #F8F9FA;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: var(--text-color);
    background-color: var(--secondary-color);
    line-height: 1.6;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  a {
    color: var(--primary-color);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }

  button {
    cursor: pointer;
    border: none;
    border-radius: 0.375rem;
    font-weight: 500;
    transition: all 0.2s ease;
    
    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }

  input, textarea {
    font-family: inherit;
    font-size: 1rem;
    padding: 0.75rem 1rem;
    border: 1px solid var(--border-color);
    border-radius: 0.375rem;
    width: 100%;
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(94, 114, 228, 0.3);
    }
  }
`;

export default GlobalStyle;