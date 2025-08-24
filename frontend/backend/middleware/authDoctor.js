import jwt from 'jsonwebtoken';

const authDoctor = async (req, res, next) => {
    try {
        const doctorToken = req.headers.authorization?.split(' ')[1];

        if (!doctorToken) {
            return res.status(401).json({ success: false, message: 'Unauthorized, Please Try Again' });
        }

        const token_decode = jwt.verify(doctorToken, process.env.JWT_SECRET_KEY);
        req.docId = { _id: token_decode.id }; // Change token_decode._id to token_decode.id
        next();

    } catch (error) {
        return res.status(401).json({ success: false, message: error.message || 'Unauthorized' });
    }
};

export default authDoctor;