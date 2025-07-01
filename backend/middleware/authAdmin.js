import jwt from 'jsonwebtoken';

const authAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ success: false, message: 'Unauthorized, Please Try Again' });
        }
        
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized, Please Try Again' });
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const expectedTokenContent = process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD;
        
        if (token_decode !== expectedTokenContent) {
            return res.status(401).json({ success: false, message: 'Unauthorized, Please Try Again' });
        }
        
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: error.message || 'Unauthorized' });
    }
};

export default authAdmin;