import React, { useState, useEffect } from 'react';

const CRUDOperationsDemo = () => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingTodo, setEditingTodo] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        completed: false
    });

    // Fetch todos
    const fetchTodos = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');

            if (!response.ok) {
                throw new Error('Failed to fetch todos');
            }

            const data = await response.json();
            setTodos(data);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchTodos();
    }, []);

    // Create new todo
    const createTodo = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError(null);

            const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: formData.title,
                    completed: formData.completed,
                    userId: 1
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create todo');
            }

            const newTodo = await response.json();

            // JSONPlaceholder tidak benar-benar menyimpan data, jadi kita simulasi
            newTodo.id = Date.now(); // ID sementara
            setTodos(prev => [newTodo, ...prev]);

            // Reset form
            setFormData({ title: '', completed: false });

            console.log('Todo created:', newTodo);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Update todo
    const updateTodo = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${editingTodo.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...editingTodo,
                    title: formData.title,
                    completed: formData.completed
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update todo');
            }

            const updatedTodo = await response.json();

            // Update local state
            setTodos(prev => prev.map(todo =>
                todo.id === editingTodo.id ? { ...todo, ...updatedTodo } : todo
            ));

            // Reset editing state
            setEditingTodo(null);
            setFormData({ title: '', completed: false });

            console.log('Todo updated:', updatedTodo);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Delete todo
    const deleteTodo = async (id) => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete todo');
            }

            // Remove from local state
            setTodos(prev => prev.filter(todo => todo.id !== id));

            console.log('Todo deleted:', id);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Start editing
    const startEditing = (todo) => {
        setEditingTodo(todo);
        setFormData({
            title: todo.title,
            completed: todo.completed
        });
    };

    // Cancel editing
    const cancelEditing = () => {
        setEditingTodo(null);
        setFormData({ title: '', completed: false });
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="crud-demo">
            <h2>CRUD Operations Demo</h2>
            <p>Create, Read, Update, Delete operations dengan REST API</p>

            {/* Todo Form */}
            <div className="todo-form-section">
                <h3>{editingTodo ? 'Edit Todo' : 'Add New Todo'}</h3>

                <form onSubmit={editingTodo ? updateTodo : createTodo} className="todo-form">
                    <div className="form-group">
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Apa yang perlu dilakukan?"
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                name="completed"
                                checked={formData.completed}
                                onChange={handleInputChange}
                            />
                            Selesai
                        </label>
                    </div>

                    <div className="form-buttons">
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                        >
                            {loading ? 'Loading...' : editingTodo ? 'Update Todo' : 'Add Todo'}
                        </button>

                        {editingTodo && (
                            <button
                                type="button"
                                onClick={cancelEditing}
                                className="btn btn-secondary"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Todos List */}
            <div className="todos-section">
                <div className="section-header">
                    <h3>Daftar Todos ({todos.length})</h3>
                    <button
                        onClick={fetchTodos}
                        disabled={loading}
                        className="btn btn-secondary"
                    >
                        Refresh
                    </button>
                </div>

                {loading && !editingTodo ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Memuat todos...</p>
                    </div>
                ) : error ? (
                    <div className="error-state">
                        <p>{error}</p>
                        <button onClick={fetchTodos} className="btn btn-secondary">
                            Coba Lagi
                        </button>
                    </div>
                ) : (
                    <div className="todos-list">
                        {todos.map(todo => (
                            <div key={todo.id} className={`todo-card ${todo.completed ? 'completed' : ''}`}>
                                <div className="todo-content">
                                    <h4>{todo.title}</h4>
                                    <p>Status: {todo.completed ? 'Selesai' : 'Belum selesai'}</p>
                                    <p>ID: {todo.id}</p>
                                </div>

                                <div className="todo-actions">
                                    <button
                                        onClick={() => startEditing(todo)}
                                        className="btn btn-warning btn-sm"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => deleteTodo(todo.id)}
                                        disabled={loading}
                                        className="btn btn-danger btn-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}

                        {todos.length === 0 && (
                            <div className="empty-state">
                                <p>Tidak ada todos. Buat yang pertama!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* API Info */}
            <div className="api-info">
                <h4>Tentang API:</h4>
                <p>
                    Menggunakan JSONPlaceholder - API dummy gratis.
                    <strong> Data tidak benar-benar disimpan</strong> di server,
                    tetapi kita bisa simulasi semua operasi CRUD.
                </p>
            </div>
        </div>
    );
};

export default CRUDOperationsDemo;