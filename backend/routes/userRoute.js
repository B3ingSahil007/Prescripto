import express from 'express';
import { registerUser, loginUser, getUserProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment } from '../controllers/userControllers.js';
import authUser from '../middleware/authUser.js';
import upload from '../middleware/multer.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/getprofile', authUser, getUserProfile);
userRouter.post('/updateprofile', upload.single("image"), authUser, updateProfile);
userRouter.post('/book-appointment', authUser, bookAppointment);
userRouter.get('/my-appointment', authUser, listAppointment);
userRouter.post('/cancel-appointment', authUser, cancelAppointment);

export default userRouter