import doctorModel from '../models/doctorsModal.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import appointmentModel from '../models/appointmentModal.js';

// API For Changing Doctor Availability
const changeAvailability = async (req, res) => {
    try {
        const { doctorId } = req.body;
        const doctorData = await doctorModel.findById(doctorId);
        await doctorModel.findByIdAndUpdate(doctorId, { available: !doctorData.available });
        res.status(200).json({ success: true, message: 'Availability Changed Successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
}

// API For Getting Doctors List
const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email']);
        res.status(200).json({ success: true, message: 'Doctors Fetched Successfully', doctors });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
}

// API For Doctor Login
const doctorLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const doctor = await doctorModel.findOne({ email });

        if (!doctor) {
            return res.status(400).json({ success: false, message: 'Invalid Credentials, Please Try Again' });
        }

        const isMatch = await bcrypt.compare(password, doctor.password);
        if (isMatch) {
            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET_KEY);
            return res.status(200).json({ success: true, message: 'Login Successfully', token });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid Credentials, Please Try Again' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
}

// API To Get Doctor Appointments For Doctor Panel
// Updated doctorAppointments function in doctorController.js
const doctorAppointments = async (req, res) => {
    try {
        const doctorId = req.docId._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalAppointments = await appointmentModel.countDocuments({ docId: doctorId });
        const appointments = await appointmentModel.find({ docId: doctorId })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: 'Appointments Fetched Successfully',
            appointments,
            pagination: {
                total: totalAppointments,
                page,
                pages: Math.ceil(totalAppointments / limit),
                limit
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
}

// API For Mark Appointment As Completed
const markAppointmentAsCompleted = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const doctorId = req.docId._id; // Get doctor ID from auth middleware

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (appointmentData && appointmentData.docId.toString() === doctorId.toString()) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true });
            return res.status(200).json({ success: true, message: 'Appointment Marked As Completed Successfully' });
        } else {
            return res.status(400).json({ success: false, message: 'Unauthorized or appointment not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
}

// API For Mark Appointment As Cancelled
const markAppointmentAsCancelled = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const doctorId = req.docId._id; // Get doctor ID from auth middleware

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (appointmentData && appointmentData.docId.toString() === doctorId.toString()) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
            return res.status(200).json({ success: true, message: 'Appointment Marked As Cancelled Successfully' });
        } else {
            return res.status(400).json({ success: false, message: 'Unauthorized or appointment not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
}


// Get Dashboard Data For Doctor Panel
const getDashboardData = async (req, res) => {
    try {
        const doctorId = req.docId._id;

        // Get all appointments for this doctor
        const appointments = await appointmentModel.find({ docId: doctorId })
            .populate('userId', 'firstname lastname phone email')
            .sort({ createdAt: -1 });

        if (!appointments || appointments.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No appointments found',
                dashData: {
                    earning: 0,
                    patients: 0,
                    appointments: 0,
                    latestAppointments: []
                },
                totalAppointments: 0,
                totalCompletedAppointments: 0,
                totalCancelledAppointments: 0
            });
        }

        // Calculate earnings only from completed and paid appointments
        let earning = 0;
        const uniquePatients = new Set();
        const completedAppointments = new Set();

        appointments.forEach(item => {
            // Count only truly completed appointments
            if (item.isCompleted && !item.cancelled) {
                earning += item.amount || 0;
                completedAppointments.add(item._id.toString());
            }

            if (item.userId) {
                uniquePatients.add(item.userId.toString());
            }
        });

        // Get latest 5 appointments
        const latestAppointments = appointments.slice(0, 5);

        // Get accurate counts
        const totalAppointments = appointments.length;
        const totalCompletedAppointments = appointments.filter(a => a.isCompleted && !a.cancelled).length;
        const totalCancelledAppointments = appointments.filter(a => a.cancelled).length;

        const dashData = {
            earning,
            patients: uniquePatients.size,
            appointments: totalAppointments,
            latestAppointments,
            totalCompletedAppointments,
            totalCancelledAppointments,
        };

        res.status(200).json({
            success: true,
            message: 'Dashboard Data Fetched Successfully',
            dashData
        });

    } catch (error) {
        console.error('Error in getDashboardData:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
}

// API For Getting Doctor Profile
const getDoctorProfile = async (req, res) => {
    try {
        const doctorId = req.docId._id; // Correct way to access doctorId from auth middleware
        const doctor = await doctorModel.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }
        res.status(200).json({ 
            success: true, 
            message: 'Doctor profile fetched', 
            doctor 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// API For Updating Doctor Profile
const updateDoctorProfile = async (req, res) => {
    try {
        const {
            name,
            speciality,
            experience,
            hospital,
            phone,
            email,
            address,
            about,
            fees,
            available
        } = req.body;

        const doctorId = req.docId._id;

        const updatedDoctor = await doctorModel.findByIdAndUpdate(
            doctorId,
            {
                $set: {
                    name,
                    speciality,
                    experience,
                    hospital,
                    phone,
                    email,
                    address: typeof address === 'string' ? JSON.parse(address) : address,
                    about,
                    fees: Number(fees), // Ensure fees is stored as number
                    available: available === 'true' || available === true // Convert to boolean
                }
            },
            { new: true }
        );

        if (!updatedDoctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Doctor profile updated successfully',
            doctor: updatedDoctor
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export { changeAvailability, doctorList, doctorLogin, doctorAppointments, markAppointmentAsCompleted, markAppointmentAsCancelled, getDoctorProfile, getDashboardData, updateDoctorProfile };