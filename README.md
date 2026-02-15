# Job Portal - Full Stack Application

A modern job portal application with resume parsing and company recommendation features.

## Project Structure

```
JobPortal/
├── backend/          # Express.js REST API
│   ├── config/       # Database configuration
│   ├── middlewares/  # Auth middleware
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API endpoints
│   ├── uploads/      # Resume storage
│   └── server.js     # Main server file
├── frontend/         # React + Vite frontend
│   ├── src/
│   │   ├── components/  # Navbar component
│   │   ├── context/     # Auth context
│   │   ├── pages/       # Home, Login, Register, Results
│   │   └── main.jsx     # Entry point
│   └── index.html
├── README.md
└── SETUP.md
```

## Features

- 🔐 User Authentication (JWT-based)
- 📄 Resume Upload (PDF, DOC, DOCX)
- 🤖 AI-Powered Resume Analysis (Google Gemini)
- 🎯 Intelligent Skills Extraction
- 💼 Target Role Recommendations
- 🏢 Company Type Suggestions
- ⭐ Strength Identification
- 📈 Resume Scoring & Feedback
- 💡 Actionable Improvement Suggestions
- 📊 Detailed Score Breakdown
- 📱 Responsive Design

## Tech Stack

### Backend
- Node.js + Express
- MongoDB (with Mongoose)
- JWT Authentication
- Multer for file uploads
- bcrypt for password hashing
- **Google Gemini AI** for resume analysis
- pdf-parse for PDF extraction
- mammoth for DOCX parsing

### Frontend
- React 18
- Vite
- React Router
- Axios
- Bootstrap 5

## Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string_here
JWT_SECRET=resume_secret
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
```

**Getting MongoDB ConectionString:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password
6. Replace `<database>` with your database name (e.g., `JobPortal`)

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/JobPortal?retryWrites=true&w=majority
```

**Getting Gemini API Key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy and add to `.env` file

📚 **Detailed Setup Guide**: See [backend/GEMINI_SETUP.md](backend/GEMINI_SETUP.md)

Start the backend server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Resume
- `POST /api/resume/upload` - Upload and analyze resume (AI-powered)
- `GET /api/resume/history` - Get all user's resumes
- `GET /api/resume/:id` - Get specific resume analysis
- `DELETE /api/resume/:id` - Delete resume

## Running the Full Application

1. **Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

2. **Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

3. Open browser and navigate to `http://localhost:5173`

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key
```

## Key Features Explained

### AI-Powered Resume Analysis
The system uses **Google Gemini Pro** to provide intelligent resume analysis:

1. **Document Parsing**: Extracts text from PDF, DOC, and DOCX files
2. **AI Analysis**: Gemini acts as an expert HR professional to analyze:
   - Professional summary
   - Key skills (technical & soft)
   - Experience with achievements
   - Education background
   - Target roles with match percentages (e.g., "Software Engineer - 92% match")
   - Suitable company types and industries
   - Candidate strengths
   - Areas for improvement with actionable suggestions
3. **Resume Scoring**: Provides overall score (0-100) with breakdown:
   - Content quality
   - Formatting
   - Impact
   - Clarity
4. **Database Storage**: Saves analysis for future reference

### Service Architecture
The backend follows a modular service pattern:
- **File Parser Service**: Handles multi-format document parsing
- **Gemini AI Service**: Manages AI analysis and prompt engineering
- **Resume Service**: Handles database operations for resume data

📚 **Technical Documentation**: See [backend/RESUME_SERVICE_DOCS.md](backend/RESUME_SERVICE_DOCS.md)

## Project Status

✅ **All legacy files removed - Clean modern structure**
- Legacy Handlebars templates have been converted to React
- Old Express server replaced with REST API
- MongoDB configured with environment variables
- Full separation of frontend and backend

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  university: String,
  role: String,
  skills: String,
  linkedIn: String,
  timestamps: true
}
```

### Resume Model
```javascript
{
  userId: ObjectId (ref: User),
  filename: String,
  extractedText: String,
  analysis: {
    summary: String,
    keySkills: [String],
    experience: [Object],
    education: [Object],
    targetRoles: [Object],
    targetCompanies: [Object],
    strengths: [String],
    areasOfImprovement: [Object],
    overallScore: Number,
    scoreBreakdown: Object
  },
  metadata: {
    fileSize: Number,
    fileType: String,
    pageCount: Number
  },
  uploadedAt: Date,
  timestamps: true
}
```

## Development Notes

- Backend uses cookie-based JWT authentication
- Frontend has axios configured with credentials
- CORS is enabled for `http://localhost:5173`
- File uploads are limited to 5MB
- Supported resume formats: PDF, DOC, DOCX
- AI analysis typically takes 3-10 seconds per resume
- Gemini AI free tier: 60 requests/min, 1500 requests/day
- Resume data stored in MongoDB for history tracking
- Modular service architecture for easy maintenance

## Security Features

- Passwords hashed with bcrypt (10 rounds)
- HTTP-only cookies for JWT
- CORS configuration
- Input validation with validator.js
- Secure headers in production
- API keys stored in environment variables
- File uploads validated by type and size
- User-specific access control for resumes

## Future Enhancements

## Future Enhancements

- [x] ~~Actual resume parsing implementation~~ ✅ **COMPLETED**
- [x] ~~AI-powered resume analysis~~ ✅ **COMPLETED**
- [ ] Real-time company database matching
- [ ] Job board integration with live listings
- [ ] Email verification
- [ ] Password reset functionality
- [ ] User profile management
- [ ] Job application tracking system
- [ ] Resume version comparison
- [ ] Batch resume upload
- [ ] PDF report generation
- [ ] Resume templates and builder

## Troubleshooting

**MongoDB Connection Error:**
- Verify your connection string
- Check if your IP is whitelisted in MongoDB Atlas
- Ensure database user has proper permissions

**Gemini API Errors:**
- Verify API key is correct in `.env`
- Check if Generative Language API is enabled
- Monitor rate limits (60/min, 1500/day free tier)
- See [GEMINI_SETUP.md](backend/GEMINI_SETUP.md) for detailed guide

**Resume Upload Failures:**
- Ensure file is under 5MB
- Verify file format (PDF, DOC, DOCX only)
- Check if file contains readable text (not scanned images)
- Review backend logs for specific errors

**Port Already in Use:**
- Backend: Change `PORT` in `.env`
- Frontend: Change `port` in `vite.config.js`

**CORS Errors:**
- Verify frontend URL in backend `server.js` CORS config
- Check if credentials are properly set
- Check if credentials are properly set

## License

ISC
