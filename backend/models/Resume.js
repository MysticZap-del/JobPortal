import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RegisterData',
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    extractedText: {
        type: String,
        required: true
    },
    // User preferences collected during onboarding
    userPreferences: {
        rolesInterested: [{
            type: String
        }],
        sectorsInterested: [{
            type: String
        }],
        workTypePreference: [{
            type: String,
            enum: ['Remote', 'Offline', 'Hybrid', 'Job', 'Internship', 'Freelance']
        }],
        yearsOfExperience: {
            type: Number,
            min: 0
        }
    },
    analysis: {
        summary: {
            type: String,
            required: true
        },
        keySkills: [{
            type: String
        }],
        strengths: [{
            type: String
        }],
        experience: [{
            role: String,
            company: String,
            duration: String,
            keyAchievements: [String]
        }],
        education: [{
            degree: String,
            institution: String,
            year: String,
            specialization: String
        }],
        recommendedRoles: [{
            role: String,
            reason: String,
            alignmentWithUserPreference: String
        }],
        targetSectors: [{
            sectorName: String,
            industries: [String],
            reason: String
        }],
        areasOfImprovement: {
            resumeImprovements: [{
                area: String,
                suggestion: String,
                priority: {
                    type: String,
                    enum: ['high', 'medium', 'low']
                }
            }],
            skillGaps: [{
                skill: String,
                reason: String,
                priority: {
                    type: String,
                    enum: ['high', 'medium', 'low']
                }
            }],
            projectSuggestions: [{
                project: String,
                description: String,
                skills: [String]
            }]
        }
    },
    metadata: {
        fileSize: Number,
        fileType: String,
        pageCount: Number
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
resumeSchema.index({ userId: 1, uploadedAt: -1 });

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
