import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import Capture from './capture';
import ForumPage from './ForumPage'; // You'll need to create this file
import ChatInterface from './components/chatinterface';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/capture" element={<Capture />} />
        <Route path="/forum" element={<ForumPage />} />
        <Route path = "/chat" element={<ChatInterface/>}/>
      </Routes>
    </Router>
  </StrictMode>
);
