import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ForumPage(props) {
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [newThread, setNewThread] = useState({ title: '', content: '' });
  const [newReply, setNewReply] = useState('');
  const [showNewThreadForm, setShowNewThreadForm] = useState(false);
  const isLogged = props.isLogged

  const navigate = useNavigate();

  useEffect(() => {
    console.log(props.isLogged)
    fetchThreads();
  }, []);

  const fetchThreads = () => {
    fetch('http://localhost:5000/api/threads')
      .then(response => response.json())
      .then(data => setThreads(data))
      .catch(error => console.error('Error fetching threads:', error));
  };

  const fetchThread = (id) => {
    fetch(`http://localhost:5000/api/threads/${id}`)
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => {
            throw new Error(err.error || `Server returned ${response.status}`);
          }).catch(() => {
            throw new Error(`Server returned ${response.status}`);
          });
        }
        return response.json();
      })
      .then(data => setSelectedThread(data))
      .catch(error => {
        console.error('Error fetching thread:', error);
        alert('Unable to load thread. It may have been deleted or does not exist.');
      });
  };

  const handleCreateThread = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/api/threads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newThread),
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        setThreads([data, ...threads]);
        setNewThread({ title: '', content: '' });
        setShowNewThreadForm(false);
      })
      .catch(error => console.error('Error creating thread:', error));
  };

  const handleAddReply = (e) => {
    e.preventDefault();
    if (!selectedThread) return;

    fetch(`http://localhost:5000/api/threads/${selectedThread._id}/replies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newReply }),
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        setSelectedThread(data);
        setNewReply('');
      })
      .catch(error => console.error('Error adding reply:', error));
  };

  return (
    <div className="bg-gray-800 text-white flex flex-col justify-center items-center p-10">
      <h1 className='text-6xl font-extrabold tracking-wide mb-4 font-serif'>Anonymous Forum</h1>
      
      {!selectedThread && (
        <>
          <button 
            className={`new-thread-btn mb-4 px-4 py-2 rounded ${!isLogged ? 'opacity-50 cursor-not-allowed bg-gray-500' : 'bg-white text-black hover:bg-gray-200'}`}
            onClick={() => isLogged && setShowNewThreadForm(!showNewThreadForm)}
            disabled={!isLogged}
          >
            {showNewThreadForm ? 'Cancel' : 'Start New Thread'}
          </button>

          {showNewThreadForm && (
            <form onSubmit={handleCreateThread} className="thread-form flex flex-col gap-3 w-full max-w-md">
              <input
                type="text"
                value={newThread.title}
                onChange={(e) => setNewThread({...newThread, title: e.target.value})}
                placeholder="Thread Title"
                required
                className="p-2 text-white rounded"
                disabled={!isLogged}
              />
              <textarea
                value={newThread.content}
                onChange={(e) => setNewThread({...newThread, content: e.target.value})}
                placeholder="Thread Content"
                required
                className="p-2 text-white rounded"
                disabled={!isLogged}
              />
              <button 
                type="submit"
                disabled={!isLogged}
                className={`py-2 px-4 rounded ${!isLogged ? 'opacity-50 cursor-not-allowed bg-gray-500' : 'bg-white text-black hover:bg-gray-200'}`}
              >
                Create Thread
              </button>
            </form>
          )}

          <div className="threads-list w-full mt-6 space-y-4">
            {threads.length > 0 ? (
              threads.map(thread => (
                <div 
                  key={thread._id || thread.id} 
                  className="bg-white text-black p-4 rounded shadow cursor-pointer hover:bg-gray-100"
                  onClick={() => fetchThread(thread._id || thread.id)}
                >
                  <h3 className='font-semibold'>{thread.title}</h3>
                  <p className="text-sm">{thread && thread.content ? thread.content.substring(0, 100) + '...' : 'No content available'}</p>
                  <div className="text-xs text-gray-600 mt-2">
                    <span>By: {thread.author || 'Anonymous'} | </span>
                    <span>Replies: {thread.replies ? thread.replies.length : 0} | </span>
                    <span>Posted: {thread.createdAt ? new Date(thread.createdAt).toLocaleString() : 'Unknown date'}</span>
                  </div>
                </div>
              ))
            ) : (
              <p>No threads yet. Be the first to post!</p>
            )}
          </div>
        </>
      )}

      {selectedThread && (
        <div className="thread-detail w-full max-w-2xl mt-6">
          <button 
            className="mb-4 px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-200"
            onClick={() => setSelectedThread(null)}
          >
            Back to Threads
          </button>
          
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>{selectedThread.title}</h2>
          <p className="text-gray-700 mb-2">{selectedThread.content || 'No content available'}</p>
          <div className="text-sm text-gray-800 mb-4">
            <span>By: {selectedThread.author || 'Anonymous'} | </span>
            <span>Posted: {selectedThread.createdAt ? new Date(selectedThread.createdAt).toLocaleString() : 'Unknown date'}</span>
          </div>

          <h3 className='text-xl text-gray-300 mb-2'>Replies ({selectedThread.replies ? selectedThread.replies.length : 0})</h3>
          <div className="space-y-3 mb-6">
            {selectedThread.replies && selectedThread.replies.length > 0 ? (
              selectedThread.replies.map((reply, index) => (
                <div key={index} className="bg-white text-black p-3 rounded shadow">
                  <p>{reply.content}</p>
                  <div className="text-xs text-gray-600 mt-1">
                    <span>By: {reply.author || 'Anonymous'} | </span>
                    <span>Posted: {reply.createdAt ? new Date(reply.createdAt).toLocaleString() : 'Unknown date'}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className='text-white'>No replies yet. Be the first to respond!</p>
            )}
          </div>

          <form onSubmit={handleAddReply} className="reply-form flex flex-col gap-3">
            <textarea
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              placeholder="Your reply..."
              required
              className="p-2 rounded text-black"
              disabled={!isLogged}
            />
            <button 
              className={`w-60 py-3 rounded-xl shadow-md transition ${!isLogged ? 'opacity-50 cursor-not-allowed bg-gray-500' : 'bg-white text-gray-800 hover:bg-gray-200'}`}
              type="submit"
              disabled={!isLogged}
            >
              Post Reply
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ForumPage;
