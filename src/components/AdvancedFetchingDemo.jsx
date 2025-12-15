import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdvancedFetchingDemo = () => {
  const [users, setUsers] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [loading, setLoading] = useState({ users: true, posts: false });
  const [error, setError] = useState({ users: null, posts: null });
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Fetch semua users menggunakan Axios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(prev => ({ ...prev, users: true }));
        setError(prev => ({ ...prev, users: null }));

        console.log('Fetching users...');
        // Axios otomatis handle JSON parsing dan error status
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');

        console.log('Users berhasil diambil:', response.data);
        setUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(prev => ({ ...prev, users: err.message }));
      } finally {
        setLoading(prev => ({ ...prev, users: false }));
      }
    };

    fetchUsers();
  }, []); // Run sekali saat mount

  // 2. Fetch posts berdasarkan user ID (dependent fetching)
  useEffect(() => {
    if (!selectedUserId) return;

    const fetchUserPosts = async () => {
      try {
        setLoading(prev => ({ ...prev, posts: true }));
        setError(prev => ({ ...prev, posts: null }));

        console.log(`Fetching posts untuk user ${selectedUserId}...`);
        // Menggunakan Axios dengan error handling built-in
        const response = await axios.get(`https://jsonplaceholder.typicode.com/posts?userId=${selectedUserId}`);

        console.log('Posts berhasil diambil:', response.data);
        setUserPosts(response.data);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(prev => ({ ...prev, posts: err.message }));
      } finally {
        setLoading(prev => ({ ...prev, posts: false }));
      }
    };

    fetchUserPosts();
  }, [selectedUserId]); // Dependency: Re-fetch ketika selectedUserId berubah

  // 3. Filter users berdasarkan search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 4. Reset selection
  const resetSelection = () => {
    setSelectedUserId('');
    setUserPosts([]);
    setSearchTerm('');
  };

  // 5. Set selected user ID
  const setSelectedUserToId = (id) => {
      setSelectedUserId(id);
      setUserPosts([]); // Clear posts saat ganti user
      setError(prev => ({...prev, posts: null})) // Clear post error
  }

  const selectedUser = users.find(u => u.id.toString() === selectedUserId);

  return (
    <div className="advanced-fetching-demo">
      <h2>Advanced Data Fetching Demo</h2>
      <p>Dependent fetching, search, dan optimisasi dengan Axios</p>

      {/* Search Box */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Cari user berdasarkan nama atau email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button onClick={resetSelection} className="btn-btn-secondary">
          Reset
        </button>
      </div>

      {/* Users List */}
      <div className="users-section">
        <h3>Daftar Users</h3>
        {loading.users ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Memuat daftar users...</p>
          </div>
        ) : error.users ? (
          <div className="error-state">
            <p>{error.users}</p>
          </div>
        ) : (
          <div className="users-grid">
            {filteredUsers.map(user => (
              <div
                key={user.id}
                className={`user-card ${selectedUserId === user.id.toString() ? 'active' : ''}`}
                onClick={() => setSelectedUserToId(user.id.toString())}
              >
                <p><strong>{user.name}</strong></p>
                <p>{user.email}</p>
                <p>{user.company.name}</p>
                <p>{user.website}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Posts */}
      {selectedUserId && (
        <div className="posts-section">
          <h3>
            Posts dari User {selectedUser?.name || selectedUserId}
            {loading.posts && <span className="loading-badge">Loading...</span>}
          </h3>
          {error.posts ? (
            <div className="error-state">
              <p>{error.posts}</p>
            </div>
          ) : (
            <div>
              <div className="posts-list">
                {userPosts.map(post => (
                  <div key={post.id} className="post-item">
                    <h4>{post.title}</h4>
                    <p>{post.body}</p>
                  </div>
                ))}
              </div>
              {userPosts.length === 0 && !loading.posts && (
                <div className="empty-state">
                  <p>User ini belum membuat posts</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Statistics */}
      <div className="stats-section">
        <h3>Statistics</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">{users.length}</span>
            <span className="stat-label">Total Users</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{filteredUsers.length}</span>
            <span className="stat-label">Filtered Users</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{userPosts.length}</span>
            <span className="stat-label">User Posts</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{selectedUserId ? 'Ya' : 'Tidak'}</span>
            <span className="stat-label">User Selected</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFetchingDemo;