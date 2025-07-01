import express from 'express';
import { doctorList, doctorLogin, doctorAppointments, markAppointmentAsCompleted, markAppointmentAsCancelled, getDoctorProfile, getDashboardData, updateDoctorProfile } from '../controllers/doctorControllers.js';
import authDoctor from '../middleware/authDoctor.js';

const doctorRouter = express.Router();

doctorRouter.get('/list', doctorList)
doctorRouter.post('/login', doctorLogin)
doctorRouter.get('/appointments', authDoctor ,doctorAppointments)
doctorRouter.post('/mark-appointment-completed', authDoctor, markAppointmentAsCompleted)
doctorRouter.post('/mark-appointment-cancelled', authDoctor, markAppointmentAsCancelled)
doctorRouter.get('/profile', authDoctor, getDoctorProfile);
doctorRouter.get('/dashboard', authDoctor, getDashboardData);
doctorRouter.put('/profile', authDoctor, updateDoctorProfile);

export default doctorRouter