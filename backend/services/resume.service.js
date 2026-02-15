import Resume from '../models/Resume.js';
import User from '../models/User.js';

/**
 * Save parsed resume data with user preferences to database
 */
const saveResumeData = async (userId, filename, parsedData) => {
    try {
        const resume = new Resume({
            userId,
            filename,
            extractedText: parsedData.extractedText,
            userPreferences: parsedData.userPreferences || {},
            analysis: {
                summary: parsedData.analysis.summary,
                keySkills: parsedData.analysis.keySkills,
                strengths: parsedData.analysis.strengths,
                experience: parsedData.analysis.experience,
                education: parsedData.analysis.education,
                recommendedRoles: parsedData.analysis.recommendedRoles,
                targetSectors: parsedData.analysis.targetSectors,
                areasOfImprovement: parsedData.analysis.areasOfImprovement
            },
            metadata: {
                fileSize: parsedData.metadata.fileSize,
                fileType: parsedData.metadata.fileType,
                pageCount: parsedData.metadata.pageCount
            }
        });

        await resume.save();
        return resume;
    } catch (error) {
        throw new Error(`Failed to save resume data: ${error.message}`);
    }
};

/**
 * Get user's resume history
 */
const getUserResumes = async (userId) => {
    try {
        const resumes = await Resume.find({ userId })
            .sort({ uploadedAt: -1 })
            .select('-extractedText'); // Exclude large text field
        return resumes;
    } catch (error) {
        throw new Error(`Failed to fetch resumes: ${error.message}`);
    }
};

/**
 * Get specific resume by ID
 */
const getResumeById = async (resumeId, userId) => {
    try {
        const resume = await Resume.findOne({ _id: resumeId, userId });
        if (!resume) {
            throw new Error('Resume not found');
        }
        return resume;
    } catch (error) {
        throw new Error(`Failed to fetch resume: ${error.message}`);
    }
};

/**
 * Delete resume
 */
const deleteResume = async (resumeId, userId) => {
    try {
        const resume = await Resume.findOneAndDelete({ _id: resumeId, userId });
        if (!resume) {
            throw new Error('Resume not found');
        }
        return resume;
    } catch (error) {
        throw new Error(`Failed to delete resume: ${error.message}`);
    }
};

export {
    saveResumeData,
    getUserResumes,
    getResumeById,
    deleteResume
};
