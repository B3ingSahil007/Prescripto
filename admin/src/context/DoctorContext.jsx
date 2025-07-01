import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = ({ children }) => {

    const backendURL = import.meta.env.VITE_PRESCRIPTO_BACKEND_URL || 'https://prescripto-backend.vercel.app/';
    const [doctorToken, setDoctorToken] = useState(localStorage.getItem('doctorToken') ? localStorage.getItem('doctorToken') : '');
    const [appointments, setAppointments] = useState([]);
    const [dashData, setDashData] = useState(false);
    const [doctorProfile, setDoctorProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(false);

    const getAppointments = async (page = 1, limit = 10) => {
        try {
            const { data } = await axios.get(`${backendURL}/api/doctor/appointments`, {
                headers: { Authorization: `Bearer ${doctorToken}` },
                params: { page, limit }
            });
            if (data.success) {
                setAppointments(data.appointments);
                return data.pagination; // Just return pagination info
            } else {
                toast.error(data.message);
                return null;
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
            return null;
        }
    }

    const completeAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(`${backendURL}/api/doctor/mark-appointment-completed`, { appointmentId }, { headers: { Authorization: `Bearer ${doctorToken}` } });
            if (data.success) {
                toast.success(data.message);
                getAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(`${backendURL}/api/doctor/mark-appointment-cancelled`, { appointmentId }, { headers: { Authorization: `Bearer ${doctorToken}` } });
            if (data.success) {
                toast.success(data.message);
                getAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    }

    // Add this function to fetch doctor profile
    const getDoctorProfile = async () => {
    try {
        setLoadingProfile(true);
        const { data } = await axios.get(`${backendURL}/api/doctor/profile`, {
            headers: { Authorization: `Bearer ${doctorToken}` }
        });
        if (data.success && data.doctor) {
            setDoctorProfile(data.doctor);
        } else {
            toast.error(data.message || 'Failed to load profile');
            setDoctorProfile(null);
        }
    } catch (error) {
        console.error(error);
        toast.error("Failed to load profile");
        setDoctorProfile(null);
    } finally {
        setLoadingProfile(false);
    }
};

    const getDashData = async () => {
        try {
            const { data } = await axios.get(`${backendURL}/api/doctor/dashboard`, { headers: { Authorization: `Bearer ${doctorToken}` } });
            if (data.success) {
                setDashData(data.dashData);
                // console.log(data.dashData);

            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    }

    const value = { backendURL, doctorToken, setDoctorToken, appointments, getAppointments, completeAppointment, cancelAppointment, doctorProfile, getDoctorProfile, dashData, setDashData, getDashData };

    return (
        <DoctorContext.Provider value={value}>
            {children}
        </DoctorContext.Provider>
    )
};

export default DoctorContextProvider