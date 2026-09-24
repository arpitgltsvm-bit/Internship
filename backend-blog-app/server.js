// backend-blog-app/server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Local Database Array (No MongoDB config needed, running 100% local)
let blogs = [
  {
    id: 1,
    title: "Getting Started with React",
    category: "Frontend",
    content: "React is a popular JavaScript library for building user interfaces..."
  },
  {
    id: 2,
    title: "Understanding Node.js Event Loop",
    category: "Backend",
    content: "The event loop is what allows Node.js to perform non-blocking I/O operations..."
  }
];

// 1. READ ALL (with Search and Category Filter)
app.get('/api/blogs', (req, res) => {
  const { search, category } = req.query;
  let filteredBlogs = [...blogs];

  if (search) {
    filteredBlogs = filteredBlogs.filter(blog => 
      blog.title.toLowerCase().includes(search.toLowerCase()) ||
      blog.content.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (category && category !== 'All') {
    filteredBlogs = filteredBlogs.filter(blog => blog.category === category);
  }

  res.json(filteredBlogs);
});

// 2. CREATE (Add a new blog)
app.post('/api/blogs', (req, res) => {
  const { title, category, content } = req.body;
  if (!title || !category || !content) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newBlog = {
    id: Date.now(),
    title,
    category,
    content
  };

  blogs.push(newBlog);
  res.status(201).json(newBlog);
});

// 3. UPDATE (Edit an existing blog)
app.put('/api/blogs/:id', (req, res) => {
  const { id } = req.params;
  const { title, category, content } = req.body;
  
  const blogIndex = blogs.findIndex(blog => blog.id === parseInt(id));
  
  if (blogIndex === -1) {
    return res.status(404).json({ message: "Blog not found" });
  }

  blogs[blogIndex] = {
    ...blogs[blogIndex],
    title: title || blogs[blogIndex].title,
    category: category || blogs[blogIndex].category,
    content: content || blogs[blogIndex].content
  };

  res.json(blogs[blogIndex]);
});

// 4. DELETE (Remove a blog)
app.delete('/api/blogs/:id', (req, res) => {
  const { id } = req.params;
  const blogIndex = blogs.findIndex(blog => blog.id === parseInt(id));

  if (blogIndex === -1) {
    return res.status(404).json({ message: "Blog not found" });
  }

  blogs.splice(blogIndex, 1);
  res.json({ message: "Blog deleted successfully" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Backend server is running smoothly on http://localhost:${PORT}`);
});
