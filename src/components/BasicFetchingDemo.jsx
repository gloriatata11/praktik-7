import React, { useState, useEffect } from 'react';

const BasicFetchingDemo = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data menggunakan Fetch API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Memulai fetching data...');
        // Simulasi delay network
        await new Promise(resolve => setTimeout(resolve, 1000));

        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');

        // Check jika response tidak OK
        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Data berhasil diambil:', data);
        setPosts(data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // Empty dependency array - run sekali saat mount

  // Function untuk refetch data
  const refetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Simulasi error dengan URL yang salah
  const fetchWithError = async () => {
    try {
      setLoading(true);
      setError(null);

      // URL yang sengaja dibuat salah untuk demo error handling
      const response = await fetch('https://jsonplaceholder.typicode.com/invalid-url');

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError(`Simulasi Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="basic-fetching-demo">
      <h2>Basic Data Fetching Demo</h2>
      <p>Mengambil data posts dari JSONPlaceholder API</p>

      {/* Control Buttons */}
      <div className="control-buttons">
        <button
          onClick={refetchData}
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? 'Memuat...' : 'Refresh Data'}
        </button>
        <button
          onClick={fetchWithError}
          disabled={loading}
          className="btn btn-warning"
        >
          Simulasi Error
        </button>
      </div>

      {/* Loading State */}
      {loading && !error && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Sedang memuat data posts...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-state">
          <h3>Terjadi Kesalahan</h3>
          <p>{error}</p>
          <button onClick={refetchData} className="btn btn-secondary">
            Coba Lagi
          </button>
        </div>
      )}

      {/* Success State */}
      {!loading && !error && (
        <div className="success-state">
          <h3>Daftar Posts ({posts.length})</h3>
          {posts.length === 0 ? (
            <p className="empty-state">Tidak ada data posts</p>
          ) : (
            <div className="posts-grid">
              {posts.map(post => (
                <div key={post.id} className="post-card">
                  <h4>{post.title}</h4>
                  <p>{post.body}</p>
                  <span>Post ID: {post.id}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Debug Info */}
      <div className="debug-info">
        <h3>Status Info</h3>
        <ul>
          <li>Loading: {loading ? 'Ya' : 'Tidak'}</li>
          <li>Error: {error || 'Tidak ada'}</li>
          <li>Jumlah Posts: {posts.length}</li>
        </ul>
      </div>
    </div>
  );
};

export default BasicFetchingDemo;