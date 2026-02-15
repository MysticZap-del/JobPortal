import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import resumeRoutes from './routes/resume.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Vite default port
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ message: 'Server is running', timestamp: new Date() });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
