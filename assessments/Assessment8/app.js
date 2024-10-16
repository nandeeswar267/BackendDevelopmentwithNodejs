const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/User');   // Import the User model
const { sendOTPEmail } = require('./emailService');
const crypto = require('crypto');        // To generate OTP
const path = require('path');
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

// Function to generate OTP
const generateOTP = () => {
  return crypto.randomBytes(3).toString('hex');  // Generates a 6-digit OTP
};
// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Signup API
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

// Login API
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

// Forgot Password - Request OTP
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP and expiration time (5 minutes)
    const otp = generateOTP();
    const otpExpires = Date.now() + 5 * 60 * 1000;  // 5 minutes expiry

    // Save OTP and expiration time in user record
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send OTP email
    await sendOTPEmail(email, otp);
    
    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (err) {
    res.status(500).json({ message: 'Error requesting OTP', error: err });
  }
});

// Verify OTP and Reset Password
app.post('/verify-otp', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the OTP is valid and hasn't expired
    if (user.otp === otp && user.otpExpires > Date.now()) {
      // Reset password
      user.password = newPassword;
      user.otp = undefined;          // Clear OTP
      user.otpExpires = undefined;   // Clear OTP expiration
      await user.save();

      res.status(200).json({ message: 'Password reset successful!' });
    } else {
      res.status(400).json({ message: 'Invalid or expired OTP' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error verifying OTP', error: err });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
