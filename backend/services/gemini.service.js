import { GoogleGenerativeAI } from '@google/generative-ai';

// Lazy initialization to ensure dotenv is loaded first
let genAI = null;
const getGenAI = () => {
    if (!genAI) {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY not configured in environment variables');
        }
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    }
    return genAI;
};

/**
 * System prompt for Gemini to act as an expert HR/Career Analyst
 */
const SYSTEM_PROMPT = `You are an expert HR professional and career development analyst with years of experience in recruitment, talent assessment, and career counseling across various industries. Your role is to:

1. Deeply understand the candidate's background, skills, and experience
2. Identify key strengths and potential career paths
3. Analyze skill gaps and areas where the candidate's resume or experience is lacking
4. Provide actionable recommendations for career growth
5. Suggest next skills to learn and projects to work on based on career goals

DO NOT score the resume numerically. Focus on qualitative understanding and growth recommendations.

Analyze the resume and provide a comprehensive JSON response with the following structure:
{
  "summary": "Brief 3-4 sentence professional summary capturing the candidate's background, core competencies, career trajectory, and potential",
  "keySkills": ["skill1", "skill2", ...], // Technical and soft skills found in resume
  "strengths": ["strength1", "strength2", ...], // Top 5-7 strengths based on experience and skills
  "experience": [
    {
      "role": "Job Title",
      "company": "Company Name",
      "duration": "Time period",
      "keyAchievements": ["achievement1", "achievement2"]
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "University/College Name",
      "year": "Year",
      "specialization": "Field of study"
    }
  ],
  "recommendedRoles": [
    {
      "role": "Suggested Role Title",
      "reason": "Why this role aligns with their background and skills",
      "alignmentWithUserPreference": "How this matches their stated preferences (if provided)"
    }
  ],
  "targetSectors": [
    {
      "sectorName": "Sector/Domain name (e.g., FinTech, HealthTech, E-commerce, AI/ML, etc.)",
      "industries": ["Industry1", "Industry2"],
      "reason": "Why this sector is a good fit based on their experience and skills"
    }
  ],
  "areasOfImprovement": {
    "resumeImprovements": [
      {
        "area": "Specific area of resume to improve (e.g., 'Achievement Quantification', 'Technical Skills Section')",
        "suggestion": "Concrete actionable suggestion",
        "priority": "high/medium/low"
      }
    ],
    "skillGaps": [
      {
        "skill": "Skill name that would enhance their profile",
        "reason": "Why this skill is important for their career goals and how it addresses a gap",
        "priority": "high/medium/low"
      }
    ],
    "projectSuggestions": [
      {
        "project": "Project idea title",
        "description": "Brief description of what to build/do",
        "skills": ["skill1", "skill2"] // Skills this project would demonstrate or teach
      }
    ]
  }
}

Be thorough, honest, and constructive. Focus on understanding the person deeply and identifying what's missing or could be improved for their career growth. When user preferences are provided, align recommendations accordingly while also suggesting broader opportunities they might not have considered.`;

/**
 * Analyze resume using Gemini AI with user preferences
 */
const analyzeResumeWithGemini = async (extractedText, userPreferences = null) => {
    try {
        // Get the generative model (using gemini-3-flash-preview for 2026 free tier)
        const ai = getGenAI();
        const model = ai.getGenerativeModel({ model: 'gemini-3-flash-preview' });

        // Build user preferences context if provided
        let preferencesContext = '';
        if (userPreferences && Object.keys(userPreferences).length > 0) {
            preferencesContext = `\n\nUSER PREFERENCES:\n`;
            if (userPreferences.rolesInterested && userPreferences.rolesInterested.length > 0) {
                preferencesContext += `- Interested in roles: ${userPreferences.rolesInterested.join(', ')}\n`;
            }
            if (userPreferences.sectorsInterested && userPreferences.sectorsInterested.length > 0) {
                preferencesContext += `- Interested in sectors: ${userPreferences.sectorsInterested.join(', ')}\n`;
            }
            if (userPreferences.workTypePreference && userPreferences.workTypePreference.length > 0) {
                preferencesContext += `- Work type preference: ${userPreferences.workTypePreference.join(', ')}\n`;
            }
            if (userPreferences.yearsOfExperience !== undefined) {
                preferencesContext += `- Years of experience: ${userPreferences.yearsOfExperience}\n`;
            }
            preferencesContext += `\nConsider these preferences when making recommendations, but also suggest opportunities they might not have considered.`;
        }

        // Prepare the prompt
        const prompt = `${SYSTEM_PROMPT}\n\nRESUME CONTENT:\n${extractedText}${preferencesContext}\n\nProvide your analysis in valid JSON format only, no additional text.`;

        // Generate response
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract JSON from response (handling potential markdown code blocks)
        let jsonText = text.trim();
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/```\n?/g, '');
        }

        // Parse JSON response
        const analysis = JSON.parse(jsonText);

        // Validate response structure
        validateAnalysisResponse(analysis);

        return analysis;
    } catch (error) {
        if (error.message.includes('GEMINI_API_KEY')) {
            throw error;
        }
        console.error('Gemini API Error:', error);
        throw new Error(`AI analysis failed: ${error.message}`);
    }
};

/**
 * Validate the analysis response structure
 */
const validateAnalysisResponse = (analysis) => {
    const requiredFields = [
        'summary',
        'keySkills',
        'strengths',
        'experience',
        'education',
        'recommendedRoles',
        'targetSectors',
        'areasOfImprovement'
    ];

    for (const field of requiredFields) {
        if (!(field in analysis)) {
            throw new Error(`Invalid analysis response: missing ${field}`);
        }
    }

    // Validate arrays
    if (!Array.isArray(analysis.keySkills)) {
        throw new Error('Invalid analysis: keySkills must be an array');
    }

    // Validate areasOfImprovement structure
    if (!analysis.areasOfImprovement.resumeImprovements || 
        !analysis.areasOfImprovement.skillGaps || 
        !analysis.areasOfImprovement.projectSuggestions) {
        throw new Error('Invalid analysis: areasOfImprovement must have resumeImprovements, skillGaps, and projectSuggestions');
    }

    return true;
};

/**
 * Get quick skills extraction (faster, for preview)
 */
const quickSkillsExtraction = async (extractedText) => {
    try {
        const ai = getGenAI();
        const model = ai.getGenerativeModel({ model: 'gemini-3-flash-preview' });

        const prompt = `Extract only the technical and professional skills from this resume. Return as a simple JSON array of strings.

RESUME:
${extractedText.substring(0, 3000)}

Return format: ["skill1", "skill2", "skill3", ...]`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        let jsonText = text.trim();
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/```\n?/g, '');
        }

        const skills = JSON.parse(jsonText);
        return Array.isArray(skills) ? skills : [];
    } catch (error) {
        console.error('Quick skills extraction failed:', error);
        return [];
    }
};

export {
    analyzeResumeWithGemini,
    quickSkillsExtraction,
    validateAnalysisResponse
};
