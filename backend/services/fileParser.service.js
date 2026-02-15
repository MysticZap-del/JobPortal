import fs from 'fs/promises';
import path from 'path';
import pdf from 'pdf-parse';
import mammoth from 'mammoth';

/**
 * Parse PDF file and extract text
 */
const parsePDF = async (filePath) => {
    try {
        const dataBuffer = await fs.readFile(filePath);
        const data = await pdf(dataBuffer);
        
        return {
            text: data.text,
            pageCount: data.numpages,
            metadata: data.info
        };
    } catch (error) {
        throw new Error(`PDF parsing failed: ${error.message}`);
    }
};

/**
 * Parse DOCX file and extract text
 */
const parseDOCX = async (filePath) => {
    try {
        const result = await mammoth.extractRawText({ path: filePath });
        
        return {
            text: result.value,
            pageCount: Math.ceil(result.value.length / 3000), // Approximate
            warnings: result.messages
        };
    } catch (error) {
        throw new Error(`DOCX parsing failed: ${error.message}`);
    }
};

/**
 * Parse DOC file (older Word format)
 * Note: For better DOC support, consider using textract or antiword
 */
const parseDOC = async (filePath) => {
    try {
        // For .doc files, we'll try mammoth (limited support)
        // In production, consider using textract or converting to DOCX first
        const result = await mammoth.extractRawText({ path: filePath });
        
        return {
            text: result.value,
            pageCount: Math.ceil(result.value.length / 3000),
            warnings: result.messages
        };
    } catch (error) {
        throw new Error(`DOC parsing failed: ${error.message}. Consider converting to DOCX format.`);
    }
};

/**
 * Main file parser - routes to appropriate parser based on file type
 */
const parseResumeFile = async (filePath) => {
    try {
        const ext = path.extname(filePath).toLowerCase();
        const stats = await fs.stat(filePath);
        const fileSize = stats.size;

        let parseResult;

        switch (ext) {
            case '.pdf':
                parseResult = await parsePDF(filePath);
                break;
            case '.docx':
                parseResult = await parseDOCX(filePath);
                break;
            case '.doc':
                parseResult = await parseDOC(filePath);
                break;
            default:
                throw new Error(`Unsupported file type: ${ext}`);
        }

        // Clean and normalize text
        const cleanedText = parseResult.text
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/\n\s*\n/g, '\n') // Remove empty lines
            .trim();

        return {
            extractedText: cleanedText,
            metadata: {
                fileSize,
                fileType: ext,
                pageCount: parseResult.pageCount,
                originalFilename: path.basename(filePath)
            },
            warnings: parseResult.warnings || []
        };
    } catch (error) {
        throw new Error(`File parsing failed: ${error.message}`);
    }
};

/**
 * Validate extracted text
 */
const validateExtractedText = (text) => {
    if (!text || text.trim().length < 100) {
        throw new Error('Extracted text is too short. The resume might be empty or parsing failed.');
    }

    // Check for common resume keywords to ensure it's a valid resume
    const commonKeywords = ['experience', 'education', 'skills', 'work', 'university', 'degree', 'email', 'phone'];
    const lowercaseText = text.toLowerCase();
    const hasKeywords = commonKeywords.some(keyword => lowercaseText.includes(keyword));

    if (!hasKeywords) {
        console.warn('Warning: Resume might not contain standard sections');
    }

    return true;
};

export {
    parseResumeFile,
    validateExtractedText,
    parsePDF,
    parseDOCX,
    parseDOC
};
