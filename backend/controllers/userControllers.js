import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModal.js";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorsModal.js";
import appointmentModel from "../models/appointmentModal.js";
import razorpay from "razorpay";

// API To Register User
const registerUser = async (req, res) => {
    try {
        const { firstname, lastname, address, gender, dob, phone, email, password, confirmPassword } = req.body;

        // Form Validation
        if (!firstname || !lastname || !address || !gender || !dob || !phone || !email || !password || !confirmPassword) {
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

        // Validating Confirm Password
        if (password !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'Password And Confirm Password Does Not Match, Please Try Again' });
        }

        // Adding User To Database
        const userData = { firstname, lastname, address, gender, dob, phone, email, password, confirmPassword, hashedPassword };
        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY);

        res.status(200).json({ success: true, message: 'User Registered Successfully', token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
}

// In your login API endpoint, update the response to include email
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Form Validation
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

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid Credentials, Please Try Again' });
        }

        const isMatch = await bcrypt.compare(password, user.hashedPassword);
        if (isMatch) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY);
            res.status(200).json({
                success: true,
                message: 'Login Successfully',
                token,
                user: {
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email  // Added email to the response
                }
            });
        } else {
            return res.status(400).json({ success: false, message: 'Invalid Credentials, Please Try Again' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
}

// API to get user profile data
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user._id; // Get user ID from req.user
        const userData = await userModel.findById(userId).select('-password -hashedPassword');
        if (!userData) {
            return res.status(404).json({ success: false, message: 'User Not Found' });
        }
        res.status(200).json({ success: true, userData });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
}

// API to update user profile data
const updateProfile = async (req, res) => {
    try {
        const { firstname, lastname, address, gender, dob, email, phone } = req.body;
        const imageFile = req.file;
        const userId = req.user._id;

        // Form Validation
        if (!firstname || !lastname || !address || !gender || !dob || !email || !phone) {
            return res.status(400).json({ success: false, message: 'All Fields Are Required' });
        }

        // Prepare update data
        let updateData = {
            firstname,
            lastname,
            gender,
            dob,
            email,
            phone
        };

        // Handle address (parse if string, otherwise use as-is)
        try {
            updateData.address = typeof address === 'string' ? JSON.parse(address) : address;
        } catch (error) {
            return res.status(400).json({ success: false, message: 'Invalid address format' });
        }

        // Handle image upload if present
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: "image",
                folder: "user_profiles" // Optional: organize in Cloudinary
            });
            updateData.image = imageUpload.secure_url;
        }

        // Update and return the updated document
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true } // This returns the updated document
        ).select('-password -hashedPassword');

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            message: 'User Profile Updated Successfully',
            userData: updatedUser
        });

    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error',
            error: error // Include full error for debugging
        });
    }
}

// API To Book Appointment
const bookAppointment = async (req, res) => {
    try {
        const { userId, docId, slotDate, slotTime } = req.body;
        const docData = await doctorModel.findById(docId).select('-password');

        if (!docData) {
            return res.status(404).json({ success: false, message: 'Doctor Not Available' });
        }
        let slots_booked = docData.slots_booked
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.status(400).json({ success: false, message: 'Slot Already Booked' });
            } else {
                slots_booked[slotDate].push(slotTime);
            }
        } else {
            slots_booked[slotDate] = [];
            slots_booked[slotDate].push(slotTime);
        }
        const userData = await userModel.findById(userId).select('-password');
        delete docData.slots_booked

        const appointmentData = { userId, docId, slotDate, slotTime, userData, docData, amount: docData.fees, date: Date.now() };

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        res.status(200).json({ success: true, message: 'Appointment Booked Successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
}

// API To List Appointments
const listAppointment = async (req, res) => {
    try {
        const userId = req.user._id;
        const appointments = await appointmentModel.find({ userId });
        res.status(200).json({ success: true, message: 'Appointments Fetched Successfully', appointments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
}

// API To Cancel Appointment
const cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const userId = req.user._id; // Get from authenticated user

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        if (appointmentData.userId.toString() !== userId.toString()) {
            return res.status(401).json({ success: false, message: 'Unauthorized User Action' });
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

// const razorPayInstance = new razorPay({
// key_id: process.env.RAZORPAY_KEY_ID,
// key_secret: process.env.RAZORPAY_KEY_SECRET
// })

// API To Make Payment Of Appointment Using Razorpay
const razorPayPayment = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.status(404).json({ success: false, message: 'Appointment Not Found Or Cancelled' });
        }

        const options = {
            amount: appointmentData.amount * 100,
            currency: process.env.RAZORPAY_CURRENCY,
            receipt: appointmentId,
        };

        const order = await razorPayInstance.orders.create(options)

        res.status(200).json({ success: true, message: 'Payment Link Generated Successfully', order })

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
}

// API To Verify Payment Of Appointment Using Razorpay
const verifyRazorPay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body;
        const orderInfo = await razorPayInstance.orders.fetch(razorpay_order_id);
        // console.log(orderInfo);

        if (orderInfo.status === 'paid') {
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true });
            res.json({ success: true, message: 'Payment Verified Successfully' })
        } else {
            res.json({ success: false, message: 'Payment Failed' })
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message || 'Internal Server Error' });
    }
}

export { registerUser, loginUser, getUserProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, razorPayPayment, verifyRazorPay };