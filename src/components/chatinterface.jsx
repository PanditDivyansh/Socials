import React, { useState, useEffect } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';
import '../index.css';

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const from = '24MCA0223'; // replace with dynamic user in production
  const to = '24MCA0251';   // replace with dynamic recipient in production

  useEffect(() => {
    // Fetch messages on component mount
    axios.post('http://localhost:4000/get-chats', { from, to })
      .then(res => {
        setMessages(res.data); // res.data is an array of message objects
      })
      .catch(err => {
        console.error('Failed to fetch chats', err);
      });
  }, []);

  const sendMessage = () => {
    if (input.trim() !== '') {
      const newMsg = {
        from,
        to,
        message: input
      };

      axios.post('http://localhost:4000/send-chat', newMsg)
        .then(() => {
          setMessages([...messages, {
            from,
            timestamp: new Date(),
            message: input
          }]);
          setInput('');
        })
        .catch(err => {
          console.error('Failed to send message', err);
        });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-200">
      {/* Header */}
      <div className="bg-gray-700 text-white text-center py-4 text-xl font-semibold shadow-md">
        The Socials
      </div>
      <div className="bg-gray-500 text-white text-center py-4 text-xl font-semibold shadow-md">
        Chat with Bot
      </div>

      {/* Chat Box */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-xs px-4 py-2 rounded-xl shadow-md ${
              msg.from === from ? 'bg-gray-700 text-white self-end' : 'bg-white text-gray-800 self-start'
            }`}
          >
            {msg.message}
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
