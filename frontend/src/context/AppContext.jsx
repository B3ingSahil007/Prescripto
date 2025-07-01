import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
    const currency = "INR";
    const currencySymbol = "₹";
    const backendUrl = import.meta.env.VITE_PRESCRIPTO_BACKEND_URL;
    const [doctors, setDoctors] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false);
    const [userData, setUserData] = useState(false);

    const getDoctorsData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
            if (data.success) {
                setDoctors(data.doctors);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const loadUserData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/getprofile`, { headers: { Authorization: `Bearer ${token}` } });
            if (data.success) {
                setUserData(data.userData);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error("Unauthorized, Please Login", error.message);
            if (error.response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('userData');
                setToken('');
                setUserData(null);
                window.location.pathname('/login');
            }
        }
    }

    // Logout function
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        setToken('');
        setUserData(null);
    }

    useEffect(() => {
        getDoctorsData();
    }, []);

    useEffect(() => {
        if (token) {
            loadUserData();
        } else {
            setUserData(false);
        }

    }, [token]);

    const value = { doctors, currency, currencySymbol, token, setToken, backendUrl, userData, setUserData, loadUserData, logout, getDoctorsData };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
};

export default AppContextProvider;