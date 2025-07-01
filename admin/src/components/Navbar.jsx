import { useContext } from "react";
import { assets } from "../assets/assets_admin/assets";
import { AdminContext } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";
import { DoctorContext } from "../context/DoctorContext";

const Navbar = () => {
    const { adminToken, setAdminToken } = useContext(AdminContext);
    const { doctorToken, setDoctorToken } = useContext(DoctorContext);
    const navigate = useNavigate();

    const logout = () => {
        navigate('/');
        adminToken && setAdminToken('');
        adminToken && localStorage.removeItem('adminToken');
        doctorToken && setDoctorToken('');
        doctorToken && localStorage.removeItem('doctorToken');
    }

    return (
        <>
            <div className="flex items-center justify-between px-4 sm:px-10 py-3 border-b bg-white shadow-xl sticky top-0 z-10">
                <div className="flex items-center gap-2 text-xs">
                    <img className="w-36 sm:w-40 cursor-pointer" src={assets.admin_logo} alt="Admin_Logo_Image" />
                    <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-primary">{adminToken ? 'Admin' : 'Doctor'}</p>
                </div>
                <button onClick={logout} className="bg-primary/50 text-white text-sm sm:text-base py-1 px-10 rounded-full hover:bg-white hover:text-primary border border-primary/50 transition-all duration-300">LogOut</button>
            </div>
        </>
    )
}

export default Navbar
