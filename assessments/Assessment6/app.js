const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./Models/User'); // Import the User model

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// API for Signup
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({ message: 'Signup successful!' });
  } catch (err) {
    res.status(500).json({ message: 'Error during signup', error: err });
  }
});

// API for Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists and password matches
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful!', user });
  } catch (err) {
    res.status(500).json({ message: 'Error during login', error: err });
  }
});

// API for Forgot Password
app.post('/forgot-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the password
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: 'Password updated successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Error during password reset', error: err });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
