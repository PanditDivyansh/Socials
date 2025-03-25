import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import '../index.css';
import vid from "../assets/bg2.mp4"

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (input.trim() !== '') {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
      // Simulating bot response
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: 'Hello! How can I help you?', sender: 'bot' }]);
      }, 1000);
    }
  };

  return (
    

    <div className="flex flex-col h-screen bg-gray-200">
      {/* Header */}
      <div className="bg-gray-700 text-white text-center py-4 text-xl font-semibold shadow-md">
        The Socials
      </div>
      <div className="bg-gray-500 text-white text-center py-4 text-xl font-semibold shadow-md">
        Bot*
      </div>

      {/* Chat Box */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-xs px-4 py-2 rounded-xl shadow-md ${
              msg.sender === 'user' ? 'bg-gray-700 text-white self-end' : 'bg-white text-gray-800 self-start'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="bg-white p-4 shadow-md flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="ml-3 bg-gray-700 text-white p-3 rounded-full shadow-md hover:bg-purple-600 transition"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}

export default ChatInterface;
