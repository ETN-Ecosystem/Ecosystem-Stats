import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import Heartbeat from './components/Heartbeat';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <>
      <Heartbeat />
      <App />
    </>
  </StrictMode>
);
