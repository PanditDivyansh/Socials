import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../index.css';

function OnlineUsers() {
  const [users, setUsers] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [complaint, setComplaint] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    // Fetch online users when component mounts
    axios.get('http://localhost:4000/online-users')
      .then(res => {
        setUsers(res.data); // res.data is an array of user objects
      })
      .catch(err => {
        console.error('Failed to fetch online users', err);
      });
  }, []);

  const toggleMenu = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const handleStartChat = (user) => {
    // This is to set the selected user globally or in some context if needed.
    setSelectedUser(user); 
  };

  const handleReport = (user) => {
    setSelectedUser(user);
    setShowModal(true); // Show the modal to report a complaint
  };

  const handleComplaintChange = (e) => {
    setComplaint(e.target.value); // Update complaint text as user types
  };

  const handleSubmitReport = () => {
  if (!complaint.trim()) {
    alert("Please enter a valid complaint.");
    return;
  }

  // Send the complaint to the backend
  axios.post('http://localhost:4000/report-complaint', {
    userID: selectedUser.Regno,
    complaint
  })
    .then(response => {
      if (response.status === 200) {
        console.log("Report submitted successfully:", response);
        
        // Show success message
        alert("Your complaint has been successfully submitted!");

        // Close the modal
        setShowModal(false);
        
        // Clear the input field
        setComplaint('');

        // Redirect to the main window (could be the main window or online users page)
        window.location.reload(); // This will reload the page, showing the list of online users again.
        
        // If you're using React Router, you could also use:
        // navigate('/'); // Assuming '/' is the path to your main page
      }
    })
    .catch(err => {
      console.error("Failed to submit report", err);
      alert("There was an error submitting your report.");
    });
};


  return (
    <div className="flex flex-col h-screen bg-gray-200">
      {/* Header */}
      <div className="bg-gray-900 text-white text-center py-4 text-xl font-semibold shadow-md">
        The Socials
      </div>
      <div className="bg-green-500 text-white text-center py-4 text-xl font-semibold shadow-md">
        People Online
      </div>

      {/* User List */}
      <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
        {users.length === 0 ? (
          <div className="text-center text-gray-600">No one is online 😴</div>
        ) : (
          users.map((user, index) => (
            <div key={index} className="relative" onClick={()=>setSelectedUser(index)}>
              {/* User Card */}
              <div
                onClick={() => {console.log(user)
                    setSelectedUser(user);
                    toggleMenu(index)}}
                className="flex items-center gap-4 bg-white px-4 py-3 rounded-xl shadow-md cursor-pointer hover:bg-gray-100 transition"
              >
                <div className="w-4 h-4 rounded-full bg-green-500 animate-ping" />
                <div className="text-lg font-medium text-gray-800">{user.Name}</div>
                <span className="text-sm text-gray-500 ml-auto">Online 🌐</span>
              </div>

              {/* Dropdown Menu */}
              {activeIndex === index && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border rounded-xl shadow-lg z-10">
                  <button
                    onClick={() => handleStartChat(user)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Start Chat
                  </button>

                  <button
                    onClick={() => handleReport(user)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Report
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Report Complaint Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Report a Complaint</h2>
            <textarea
              value={complaint}
              onChange={handleComplaintChange}
              rows="5"
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
              placeholder="Enter your complaint here..."
            />
            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReport}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OnlineUsers;
