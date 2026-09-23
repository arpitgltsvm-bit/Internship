const mongoose = require('mongoose');

// Define Blog Schema inline for simplified workspace synchronization
const Blog = mongoose.models.Blog || mongoose.model('Blog', new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}));

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog post not found' });
    res.json(blog);
  } catch (error) {
    res.status(400).json({ error: 'Invalid ID format structure' });
  }
};

exports.createBlog = async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const newBlog = await Blog.create({ title, content, author });
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
