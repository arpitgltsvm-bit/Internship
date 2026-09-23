const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import Route Files safely
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');

const app = express();

// Standard middleware configurations
app.use(cors());
app.use(express.json());

// 📁 Automatically serve your frontend application files from the sibling folder
app.use(express.static(path.join(__dirname, '../blog-application')));

// Main API endpoints routing configurations
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

// Database connection URL
const dbURI = "mongodb+srv://blogadmin:ClearPassword2026@starter-dev-m0-mumbai.qyczxvh.mongodb.net/blogDB?retryWrites=true&w=majority&appName=starter-dev-m0-mumbai";

console.log("Attempting to establish connection to MongoDB Cloud...");

mongoose.connect(dbURI)
  .then(() => {
    console.log('=========================================');
    console.log('🎉 SUCCESS: MongoDB Connected Successfully!');
    console.log('=========================================');
  })
  .catch(err => {
    console.log('=========================================');
    console.log('❌ ERROR: Connection Failed!');
    console.error(err.message);
    console.log('=========================================');
  });

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server initialized smoothly on port ${PORT}`);
});

