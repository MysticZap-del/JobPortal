import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;

        // Validate inputs
        if (!email || !password || !confirmPassword) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const user = new User({
            email,
            password
        });

        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({ 
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                email: user.email
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid login credentials' });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid login credentials' });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.json({ 
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Logout
router.post('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.json({ message: 'Logged out successfully' });
});

// Check auth status
router.get('/me', async (req, res) => {
    try {
        const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ isAuthenticated: false });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ isAuthenticated: false });
        }

        res.json({ 
            isAuthenticated: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(401).json({ isAuthenticated: false });
    }
});

export default router;
