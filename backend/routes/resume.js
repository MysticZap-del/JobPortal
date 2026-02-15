import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import auth from '../middlewares/auth.js';
import { parseResumeFile, validateExtractedText } from '../services/fileParser.service.js';
import { analyzeResumeWithGemini } from '../services/gemini.service.js';
import { saveResumeData, getUserResumes, getResumeById, deleteResume } from '../services/resume.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF, DOC, and DOCX files are allowed'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

/**
 * Upload and analyze resume with user preferences
 * POST /api/resume/upload
 * Body (form-data):
 *  - resume: file
 *  - rolesInterested: array of strings
 *  - sectorsInterested: array of strings
 *  - workTypePreference: array of strings
 *  - yearsOfExperience: number
 */
router.post('/upload', auth, upload.single('resume'), async (req, res) => {
    let filePath = null;
    
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        filePath = req.file.path;
        const userId = req.userId;

        // Extract user preferences from request body
        const userPreferences = {
            rolesInterested: req.body.rolesInterested ? JSON.parse(req.body.rolesInterested) : [],
            sectorsInterested: req.body.sectorsInterested ? JSON.parse(req.body.sectorsInterested) : [],
            workTypePreference: req.body.workTypePreference ? JSON.parse(req.body.workTypePreference) : [],
            yearsOfExperience: req.body.yearsOfExperience ? parseInt(req.body.yearsOfExperience) : 0
        };

        // Step 1: Parse the file and extract text
        console.log('Parsing resume file...');
        const parseResult = await parseResumeFile(filePath);
        
        // Step 2: Validate extracted text
        validateExtractedText(parseResult.extractedText);

        // Step 3: Analyze with Gemini AI including user preferences
        console.log('Analyzing resume with AI...');
        const analysis = await analyzeResumeWithGemini(parseResult.extractedText, userPreferences);

        // Step 4: Save to database with user preferences
        console.log('Saving to database...');
        const savedResume = await saveResumeData(userId, req.file.filename, {
            extractedText: parseResult.extractedText,
            analysis: analysis,
            metadata: parseResult.metadata,
            userPreferences: userPreferences
        });

        // Step 5: Prepare response
        res.json({
            message: 'Resume analyzed successfully',
            resumeId: savedResume._id,
            filename: req.file.filename,
            analysis: {
                summary: analysis.summary,
                keySkills: analysis.keySkills,
                targetRoles: analysis.targetRoles,
                targetCompanies: analysis.targetCompanies,
                strengths: analysis.strengths,
                areasOfImprovement: analysis.areasOfImprovement,
                overallScore: analysis.overallScore,
                scoreBreakdown: analysis.scoreBreakdown
            },
            metadata: parseResult.metadata
        });

    } catch (error) {
        console.error('Resume upload error:', error);
        
        // Clean up file if processing failed
        if (filePath) {
            try {
                await fs.unlink(filePath);
            } catch (unlinkError) {
                console.error('Failed to delete file:', unlinkError);
            }
        }

        res.status(500).json({ 
            message: 'Resume processing failed',
            error: error.message 
        });
    }
});

/**
 * Get all resumes for current user
 * GET /api/resume/history
 */
router.get('/history', auth, async (req, res) => {
    try {
        const resumes = await getUserResumes(req.userId);
        res.json({
            count: resumes.length,
            resumes
        });
    } catch (error) {
        console.error('Get resumes error:', error);
        res.status(500).json({ message: error.message });
    }
});

/**
 * Get specific resume by ID
 * GET /api/resume/:id
 */
router.get('/:id', auth, async (req, res) => {
    try {
        const resume = await getResumeById(req.params.id, req.userId);
        res.json(resume);
    } catch (error) {
        console.error('Get resume error:', error);
        res.status(404).json({ message: error.message });
    }
});

/**
 * Delete resume
 * DELETE /api/resume/:id
 */
router.delete('/:id', auth, async (req, res) => {
    try {
        const resume = await deleteResume(req.params.id, req.userId);
        
        // Try to delete the physical file
        try {
            const filePath = path.join('uploads', resume.filename);
            await fs.unlink(filePath);
        } catch (fileError) {
            console.warn('Could not delete file:', fileError.message);
        }

        res.json({ 
            message: 'Resume deleted successfully',
            resumeId: resume._id 
        });
    } catch (error) {
        console.error('Delete resume error:', error);
        res.status(404).json({ message: error.message });
    }
});

export default router;
