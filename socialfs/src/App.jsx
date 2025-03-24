import React, { useRef } from 'react';
import './index.css';
import vid from './assets/bg2.mp4';

function App() {
  const videoRef = useRef(null); // Fix: Initialize useRef properly for the camera

  const startCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((error) => console.error('Error accessing camera:', error));
  };

  return (
    <div className="flex h-screen">
      {/* Left Side - Social Media Landing Page */}
      <div className="w-1/2 bg-gray-700 text-white flex flex-col justify-center items-center p-10">
        {/* Title */}
        <h1 className="text-6xl font-extrabold tracking-wide mb-4 font-serif">
          The Social's
        </h1>

        {/* Description */}
        <p className="text-lg text-center max-w-md mb-6 font-light">
          Connect with people around the world. Make new friends, chat, or stay anonymous.
        </p><br></br><br></br><br></br>

        {/* Buttons */}
        <div className="flex flex-col gap-y-6">
          <button className="w-60 py-3 bg-white text-gray-800 rounded-xl shadow-md hover:bg-gray-200 transition">
            Chat with Strangers
          </button>
          <button className="w-60 py-3 bg-white text-gray-800 rounded-xl shadow-md hover:bg-gray-200 transition">
            Connect with a Friend
          </button>
          <button className="w-60 py-3 bg-white text-gray-800 rounded-xl shadow-md hover:bg-gray-200 transition">
            Be Anonymous
          </button>
        </div>
      </div>

      {/* Right Side - Camera Box with Video Background */}
      <div className="w-1/2 flex justify-center items-center bg-white relative overflow-hidden">
        {/* Background Video */}
        <video
          className="absolute inset-0 h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={vid} type="video/mp4" /> {/* Fix: Use correct imported video file */}
        </video>

        {/* Dark Overlay for Better Visibility */}
        <div className="absolute inset-0 bg-black opacity-40"></div>

        {/* Camera Preview Box */}
        <div className="w-80 h-96 bg-gray-700 rounded-xl overflow-hidden relative shadow-lg z-10">
          <video ref={videoRef} autoPlay className="w-full h-full"></video>
          <button 
            onClick={startCamera}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-gray-700 px-5 py-2 rounded-full shadow-md hover:bg-gray-200 transition">
            Show ID
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
