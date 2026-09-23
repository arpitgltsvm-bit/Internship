const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Define User Schema inline for simple structure validation
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}));

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({ email, password: hashedPassword });
    
    res.status(201).json({ message: 'User registered securely', userId: newUser._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

