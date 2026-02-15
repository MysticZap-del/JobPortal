# Job Portal - Setup Guide

## Quick Start

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Configure MongoDB
1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster (free tier is fine)
3. Create a database user
4. Get your connection string
5. Update `backend/.env` file with your MongoDB URI

### 3. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Access the Application
Open your browser and go to: http://localhost:5173

## Current Status

| Component | Status | Details |
|-----------|--------|----------|
| Backend API | ✅ Running | Port 5000, Connected to MongoDB Atlas |
| Frontend | ✅ Running | Port 5173, React + Vite |
| Database | ✅ Connected | MongoDB Atlas Cloud Database |
| Authentication | ✅ Working | JWT + bcrypt |
| File Upload | ✅ Ready | Multer configured (PDF, DOC, DOCX) |

## What's Changed

✅ Separated frontend and backend
✅ Converted Handlebars templates to React components
✅ Configured MongoDB with environment variables (MongoDB Atlas)
✅ Added JWT authentication with cookies
✅ Implemented RESTful API
✅ Added React Router for navigation
✅ Preserved all existing authentication logic
✅ Cleaned up legacy code (removed src/, templates/, public/)
✅ Modern development setup with hot reload

## Architecture

**Before:**
- Monolithic Express app with HBS templates
- Local MongoDB connection hardcoded

**After:**
- Backend: Express REST API (Port 5000)
- Frontend: React + Vite (Port 5173)
- MongoDB: Cloud-based with env configuration
- Same authentication logic preserved
