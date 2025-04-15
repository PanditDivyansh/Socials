import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import vid from './assets/bg2.mp4';
import ChatInterface from './components/chatinterface';
import approve from './assets/approved.png'
import ForumPage from './ForumPage'
import OnlineUsers from './components/Friendsavl';
import { UserProvider } from './components/UserContext';
import { Link } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [userData, setUserData] = useState(null); // Store Extract API data
  const [isLogged, setIsLogged] = useState(false); // Track login status

  // Fetch user data after login
  useEffect(() => {
    if (!isLogged) {
      fetch("http://localhost:5000/api/get-user") // Replace with actual API endpoint
        .then(response => response.json())
        .then(data => {
          if (data.length > 0) {
            setUserData(data[data.length - 1]); // Show the latest user data
            setIsLogged(true);
          }
        })
        .catch(error => console.error("Error fetching user data:", error));
    }
  }, [isLogged]);

  const startCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsLogged(true); // Simulate login after camera access
      })
      .catch((error) => console.error("Error accessing camera:", error));
  };

  // Scroll to section functions
  const scrollToChat = () => {
    const chatSection = document.getElementById('chat-section');
    if (chatSection) {
      chatSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToFriends = () => {
    const friendsSection = document.getElementById('friends-section');
    if (friendsSection) {
      friendsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToForum = () => {
    const forumSection = document.getElementById('forum-section');
    if (forumSection) {
      forumSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    // <UserProvider>
    <>
      <div className="flex h-screen">
        {/* Left Side - Social Media Landing Page */}
        <div className="w-1/2 bg-gray-700 text-white flex flex-col justify-center items-center p-10">
          <h1 className="text-6xl font-extrabold tracking-wide mb-4 font-serif">
            The Social's
          </h1>
          <p className="text-lg text-center max-w-md mb-6 font-light">
            Connect with people around the world. Make new friends, chat, or stay anonymous.
          </p>

          <div className="flex flex-col gap-y-6">
            <button 
              disabled={!isLogged} 
              onClick={scrollToChat}
              className={`w-60 py-3 rounded-xl shadow-md transition ${
                !isLogged ? "bg-gray-300 text-gray-600 opacity-50 cursor-not-allowed" 
                         : "bg-white text-gray-800 hover:bg-gray-200"
              }`}
            >
              Chat with Strangers
            </button>

            <button 
              disabled={!isLogged} 
              onClick={scrollToFriends}
              className={`w-60 py-3 rounded-xl shadow-md transition ${
                !isLogged ? "bg-gray-300 text-gray-600 opacity-50 cursor-not-allowed" 
                         : "bg-white text-gray-800 hover:bg-gray-200"
              }`}
            >
              Connect with a Friend
            </button>

            <button 
              disabled={!isLogged} 
              onClick={scrollToForum}
              className={`w-60 py-3 rounded-xl shadow-md transition ${
                !isLogged ? "bg-gray-300 text-gray-600 opacity-50 cursor-not-allowed" 
                         : "bg-white text-gray-800 hover:bg-gray-200"
              }`}
            >
              Be Anonymous
            </button>
            
            <button 
              onClick={() => navigate('/capture')}
              className="w-60 py-3 bg-blue-500 text-white rounded-xl shadow-md hover:bg-blue-600 transition">
              Capture ID
            </button>
          </div>
        </div>

        {/* Right Side - Camera Box with Video Background */}
        <div className="w-1/2 flex justify-center items-center bg-white relative overflow-hidden">
          <video
            className="absolute inset-0 h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={vid} type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-black opacity-40"></div>

          <div className="w-80 h-96 bg-gray-700 rounded-xl overflow-hidden relative shadow-lg z-10 p-4">
            
              <div className="text-white text-center">
                {isLogged ? <p className="text-sm text-green-400">Login Successful</p> : ""}
                
                  <div className="mt-2">
                    <p className="text-xl">Name: {isLogged ? userData.name : <span className='text-yellow-100'>UserName</span>}</p>
                    <p className="text-xl">Registration Number: {isLogged ? userData.registrationNumber : <span className='text-yellow-100'>Reg No.</span>}</p>
                  </div>
                  {isLogged ? (
                    <div>
                      <img src={approve} alt="Approval Icon" />
                    </div>
                  ) : ""}
              </div>
            
            {!isLogged && (
              <button 
                onClick={startCamera}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-gray-700 px-5 py-2 rounded-full shadow-md hover:bg-gray-200 transition">
                Show ID
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Chat Interface Section */}
      {isLogged && (
        <div id="chat-section" className="w-full h-full flex justify-center items-center bg-white relative overflow-hidden">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={vid} type="video/mp4" /> 
          </video>
          
          <div className="absolute inset-0 bg-black opacity-50"></div>

          <div className="w-100 h-full bg-gray-700 rounded-xl overflow-hidden relative shadow-lg z-10 mr-5">
            <ChatInterface />
          </div>
          
          <div id="friends-section" className="w-100 h-full bg-gray-700 rounded-xl overflow-hidden relative shadow-lg z-10 ml-5">
            <OnlineUsers />
          </div>
        </div>
      )}
      
      <div id="forum-section">
        <ForumPage isLogged={isLogged} />
      </div>
    </>
    // </UserProvider>
  );
}

export default App;
