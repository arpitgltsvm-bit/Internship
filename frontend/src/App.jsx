// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css'; // Points to your global styles

const API_URL = 'http://localhost:5000/api/blogs';

function App() {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  // Form States
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Fetch blogs on load, search, or filter change
  useEffect(() => {
    fetchBlogs();
  }, [search, categoryFilter]);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${API_URL}?search=${search}&category=${categoryFilter}`);
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  // Handle Create or Update submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return alert("Please fill out all fields");

    try {
      if (editingId) {
        // Update operational step
        await axios.put(`${API_URL}/${editingId}`, { title, category, content });
        setEditingId(null);
      } else {
        // Create operational step
        await axios.post(API_URL, { title, category, content });
      }
      
      // Clear Form
      setTitle('');
      setCategory('General');
      setContent('');
      fetchBlogs();
    } catch (error) {
      console.error("Error saving blog:", error);
    }
  };

  // Populate data into form for editing
  const handleEdit = (blog) => {
    setEditingId(blog.id);
    setTitle(blog.title);
    setCategory(blog.category);
    setContent(blog.content);
  };

  // Handle Delete operation
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchBlogs();
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
  };

  return (
    <div className="container">
      <h1>Blog Management Dashboard</h1>

      {/* Global Filter & Search Section */}
      <div className="filters">
        <input 
          type="text" 
          placeholder="Search blogs by title or content..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="All">All Categories</option>
          <option value="General">General</option>
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
          <option value="Design">Design</option>
        </select>
      </div>

      {/* Interactive CRUD Operations Form */}
      <form className="blog-form" onSubmit={handleSubmit}>
        <h2>{editingId ? "Edit Blog Post" : "Create New Blog Post"}</h2>
        <input 
          type="text" 
          placeholder="Blog Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="General">General</option>
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
          <option value="Design">Design</option>
        </select>
        <textarea 
          placeholder="Write your blog content here..." 
          rows="5" 
          value={content} 
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
        <button type="submit" className="btn btn-primary">
          {editingId ? "Update Post" : "Publish Post"}
        </button>
        {editingId && (
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => { setEditingId(null); setTitle(''); setContent(''); }}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Dynamic Display Feed */}
      <div className="blog-list">
        {blogs.length === 0 ? <p style={{textAlign: 'center'}}>No blogs found matching criteria.</p> : (
          blogs.map(blog => (
            <div key={blog.id} className="blog-card">
              <h3>{blog.title} <span className="category-badge">{blog.category}</span></h3>
              <p>{blog.content}</p>
              <div className="actions">
                <button className="btn btn-secondary" onClick={() => handleEdit(blog)}>Edit</button>
                <button className="btn btn-danger" onClick={() => handleDelete(blog.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
