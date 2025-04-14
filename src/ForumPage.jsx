import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ForumPage() {
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [newThread, setNewThread] = useState({ title: '', content: '' });
  const [newReply, setNewReply] = useState('');
  const [showNewThreadForm, setShowNewThreadForm] = useState(false);
  
  const navigate = useNavigate();

  // Fetch all threads
  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = () => {
    fetch('http://localhost:5000/api/threads')
      .then(response => response.json())
      .then(data => setThreads(data))
      .catch(error => console.error('Error fetching threads:', error));
  };

  // Fetch single thread with replies
  const fetchThread = (id) => {
    fetch(`http://localhost:5000/api/threads/${id}`)
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => {
            throw new Error(err.error || `Server returned ${response.status}`);
          }).catch(err => {
            throw new Error(`Server returned ${response.status}`);
          });
        }
        return response.json();
      })
      .then(data => setSelectedThread(data))
      .catch(error => {
        console.error('Error fetching thread:', error);
        // Display user-friendly error message
        alert('Unable to load thread. It may have been deleted or does not exist.');
      });
  };
  

  // Create new thread
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

  // Add reply to thread
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
    <div className="forum-container">
      <h1>Anonymous Forum</h1>
      
      {/* Thread List View */}
      {!selectedThread && (
        <>
          <button 
            className="new-thread-btn"
            onClick={() => setShowNewThreadForm(!showNewThreadForm)}
          >
            {showNewThreadForm ? 'Cancel' : 'Start New Thread'}
          </button>

          {/* New Thread Form */}
          {showNewThreadForm && (
            <form onSubmit={handleCreateThread} className="thread-form">
              <input
                type="text"
                value={newThread.title}
                onChange={(e) => setNewThread({...newThread, title: e.target.value})}
                placeholder="Thread Title"
                required
              />
              <textarea
                value={newThread.content}
                onChange={(e) => setNewThread({...newThread, content: e.target.value})}
                placeholder="Thread Content"
                required
              />
              <button type="submit">Create Thread</button>
            </form>
          )}

          <div className="threads-list">
            {threads.length > 0 ? (
              threads.map(thread => (
                <div key={thread._id || thread.id} className="thread-item" onClick={() => fetchThread(thread._id || thread.id)}>
                  <h3>{thread.title}</h3>
                  {/* Add null check here - line 111 fix */}
                  <p className="thread-preview">
                    {thread && thread.content ? thread.content.substring(0, 100) + '...' : 'No content available'}
                  </p>
                  <div className="thread-meta">
                    <span>By: {thread.author || 'Anonymous'}</span>
                    <span>Replies: {thread.replies ? thread.replies.length : 0}</span>
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

      {/* Thread Detail View */}
      {selectedThread && (
        <div className="thread-detail">
          <button 
            className="back-btn"
            onClick={() => setSelectedThread(null)}
          >
            Back to Threads
          </button>
          
          <h2>{selectedThread.title}</h2>
          <div className="thread-content">
            {/* Add null check here as well */}
            <p>{selectedThread.content || 'No content available'}</p>
            <div className="thread-meta">
              <span>By: {selectedThread.author || 'Anonymous'}</span>
              <span>Posted: {selectedThread.createdAt ? new Date(selectedThread.createdAt).toLocaleString() : 'Unknown date'}</span>
            </div>
          </div>

          <h3>Replies ({selectedThread.replies ? selectedThread.replies.length : 0})</h3>
          <div className="replies-list">
            {selectedThread.replies && selectedThread.replies.length > 0 ? (
              selectedThread.replies.map((reply, index) => (
                <div key={index} className="reply-item">
                  <p>{reply.content}</p>
                  <div className="reply-meta">
                    <span>By: {reply.author || 'Anonymous'}</span>
                    <span>Posted: {reply.createdAt ? new Date(reply.createdAt).toLocaleString() : 'Unknown date'}</span>
                  </div>
                </div>
              ))
            ) : (
              <p>No replies yet. Be the first to respond!</p>
            )}
          </div>

          <form onSubmit={handleAddReply} className="reply-form">
            <textarea
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              placeholder="Your reply..."
              required
            />
            <button type="submit">Post Reply</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ForumPage;
