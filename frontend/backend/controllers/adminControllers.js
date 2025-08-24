import validator from 'validator';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctorsModal.js';
import jwt from 'jsonwebtoken';
import appointmentModel from '../models/appointmentModal.js';
import userModel from '../models/userModal.js';

// API For Admin Login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Form validation
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'All Fields Are Required' });
        }

        // Validating E-Mail
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: 'Invalid Email, Please Try Again' });
        }

        // Validating Password
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password Must Be At Least 8 Characters' });
        }

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const tokenContent = email + password;
            const token = jwt.sign(tokenContent, process.env.JWT_SECRET_KEY);
            return res.status(200).json({
                success: true,
                message: 'Login Successfully',
                token: `Bearer ${token}`
            });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid Email Or Password, Please Try Again' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
}

// API For Adding Doctors
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address1 } = req.body;
        const imageFile = req.file;

        // Form Validation
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address1 || !imageFile) {
            return res.status(400).json({ success: false, message: 'All Fields Are Required' });
        }

        // Validating E-Mail
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: 'Invalid Email, Please Try Again' });
        }

        // Validating Password
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password Must Be At Least 8 Characters' });
        }

        // Hashing Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Image Upload To Cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageUrl = imageUpload.secure_url;

        // Adding Doctor To Database
        const doctorData = { name, email, password: hashedPassword, image: imageUrl, speciality, degree, experience, about, fees, address: address1, date: Date.now() };

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        res.status(201).json({ success: true, message: 'Doctor Added Successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
}

// API For Getting All Doctors List For Admin Panel
const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password');
        res.status(200).json({ success: true, message: 'Doctors Fetched Successfully', doctors });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
}

// API To Get All Appointments List For Admin Panel
const appointmentsAdmin = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({});
        res.status(200).json({ success: true, message: 'Appointments Fetched Successfully', appointments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
}

// API For Appointment Cancelation
const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        const { docId, slotDate, slotTime } = appointmentData;
        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })
        res.status(200).json({ success: true, message: 'Appointment Cancelled Successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
}

const adminDashboard = async (req, res) => {
    try {
        const doctors = await doctorModel.find({});
        const user = await userModel.find({});
        const appointments = await appointmentModel.find({});

        // Get current year's appointments grouped by month
        const currentYear = new Date().getFullYear();
        const monthlyAppointments = Array(12).fill(0);
        const monthlyRevenue = Array(12).fill(0);

        appointments.forEach(app => {
            const date = new Date(app.date);
            if (date.getFullYear() === currentYear) {
                const month = date.getMonth();
                monthlyAppointments[month]++;
                if (!app.cancelled && app.amount) {
                    monthlyRevenue[month] += app.amount;
                }
            }
        });

        const dashData = {
            doctors: doctors.length,
            users: user.length,
            appointments: appointments.length,
            upcomingAppointments: appointments.filter(app => !app.cancelled && !app.isCompleted).length,
            canceledAppointments: appointments.filter(app => app.cancelled).length,
            latestAppointments: appointments.reverse().slice(0, 5),
            revenue: appointments.reduce((acc, curr) => acc + (curr.cancelled ? 0 : curr.amount || 0), 0),
            monthlyAppointments,
            monthlyRevenue
        }

        res.json({ success: true, message: 'Dashboard Fetched Successfully', dashData });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
}

export { adminLogin, addDoctor, allDoctors, appointmentsAdmin, appointmentCancel, adminDashboard };