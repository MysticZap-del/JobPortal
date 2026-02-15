import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    try {
        // Check for token in cookie or Authorization header
        const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export default auth;
