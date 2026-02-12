const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = 'resume_secret';

const auth = (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.redirect('/login');
        }

        const verifyUser = jwt.verify(token, JWT_SECRET_KEY);
        if(verifyUser){
            next();
        }
        else{
            res.redirect('/login');
        }
    } catch (error) {
        res.redirect('/login');
    }
}

module.exports = auth;