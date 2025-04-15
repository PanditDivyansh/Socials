import React, { useRef, useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import vid from './assets/bg2.mp4';
import './index.css';

function Capture() {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const [showAnimation, setShowAnimation] = useState(false);

  // Start camera on mount
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          console.log('Camera started successfully.');
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };
    startCamera();
  }, []);

  const captureID = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    // Create canvas to capture the current video frame
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/png');
    console.log('Captured image data (first 50 chars):', imageData.slice(0, 50));

    try {
      console.log('Sending image to backend for OCR and saving...');
      // Call only the /api/extract-id endpoint which does OCR and saves to user_data.json
      const response = await fetch('http://localhost:5000/api/extract-id', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData }),
        credentials: 'include' // 👈 this is the key part
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('OCR response:', data);

      if (data.name && data.registrationNumber) {
        console.log('OCR extraction and storage successful.');
        
        setShowAnimation(true);

      // Wait for animation to complete before navigating
      setTimeout(() => {
        navigate('/');
      }, 2000); // Adjust time to match animation duration
    
        

        
      } else {
        console.error('OCR did not return valid data:', data);
      }
    } catch (error) {
      console.error('Error processing ID:', error);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center font-sans">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={vid} type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-6 w-full">
        <h1 className="text-4xl font-bold text-white tracking-wider">Show Your ID</h1>

        {showAnimation && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50">
          <div className="animate-bounce text-white text-3xl font-bold">
            ✅ Verified! Redirecting...
          </div>
        </div>
      )}

        {/* Camera Box */}
        <div className="w-80 h-80 bg-gray-900 rounded-2xl overflow-hidden shadow-lg border-2 border-white">
          <video ref={videoRef} autoPlay className="w-full h-full object-cover"></video>
        </div>

        {/* Show ID Button */}
        <button
          onClick={captureID}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-lg font-semibold rounded-full shadow-md transition-all hover:opacity-90"
        >
          Show ID
        </button>
      </div>
    </div>
  );
}

export default Capture;
