import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Get token from "Bearer <token>"
        
        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized, Please Try Again' });
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = { _id: token_decode._id }; // Attach user info to req.user
        next();

    } catch (error) {
        return res.status(401).json({ success: false, message: error.message || 'Unauthorized' });
    }
};

export default authUser;