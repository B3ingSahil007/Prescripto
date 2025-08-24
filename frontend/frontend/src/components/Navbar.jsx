import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets_frontend/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { CgProfile } from "react-icons/cg";
import { IoIosArrowDown } from "react-icons/io";
import { FiUser } from "react-icons/fi";
import { CiCalendarDate } from "react-icons/ci";
import { IoLogOutOutline } from "react-icons/io5";
import { CiMenuKebab } from "react-icons/ci";
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const Navbar = () => {
    const { token, setToken, logout, userData } = useContext(AppContext);
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // const userData = JSON.parse(localStorage.getItem('userData'));

    // Get user's full name from context userData
    const getUserName = () => {
        if (userData && userData.firstname && userData.lastname) {
            return `${userData.firstname} ${userData.lastname}`;
        }
        return "User"; // fallback name
    };

    const handlelogout = () => {
        logout();
        toast.success('Logged Out Successfully');
        navigate('/login');
    }

    return (
        <>
            <div className='flex sticky top-0 z-50 bg-white items-center justify-between text-sm py-4 px-4 sm:px-6 border-b border-b-gray-400 shadow-2xl'>
                <img onClick={() => { navigate('/'), scrollTo(0, 0) }} className='w-32 sm:w-44 cursor-pointer' src={assets.logo} alt="Logo_Image" />
                {/* Desktop Navigation */}
                {token ?
                    <ul className='hidden md:flex items-start gap-5 font-medium'>
                        <NavLink onClick={() => scrollTo(0, 0)} to='/' className={({ isActive }) => isActive ? "text-primary" : ""}>
                            <li className='py-1'>Home</li>
                            <hr className='border-none outline-none h-0.5 bg-[#152dff] w-3/5 m-auto hidden' />
                        </NavLink>
                        <NavLink onClick={() => scrollTo(0, 0)} to='/doctors' className={({ isActive }) => isActive ? "text-primary" : ""}>
                            <li className='py-1'>All Doctors</li>
                            <hr className='border-none outline-none h-0.5 bg-[#152dff] w-3/5 m-auto hidden' />
                        </NavLink>
                        <NavLink onClick={() => scrollTo(0, 0)} to='/about' className={({ isActive }) => isActive ? "text-primary" : ""}>
                            <li className='py-1'>About</li>
                            <hr className='border-none outline-none h-0.5 bg-[#152dff] w-3/5 m-auto hidden' />
                        </NavLink>
                        <NavLink onClick={() => scrollTo(0, 0)} to='/contact' className={({ isActive }) => isActive ? "text-primary" : ""}>
                            <li className='py-1'>Contact</li>
                            <hr className='border-none outline-none h-0.5 bg-[#152dff] w-3/5 m-auto hidden' />
                        </NavLink>
                    </ul> : ""}
                <div className='flex items-center gap-3'>
                    {token ?
                        <div className='flex items-center cursor-pointer group relative'>
                            <div onClick={() => setOpenMenu(!openMenu)} className='flex items-center gap-2'>
                                <CgProfile className='w-6 h-6 rounded-full cursor-pointer' />
                                <p className='hidden sm:block text-base'>{getUserName()}</p>
                                <IoIosArrowDown className={`w-4 h-4 cursor-pointer ${openMenu ? 'rotate-180 transition-transform duration-300' : 'rotate-0 transition-transform duration-300'}`} />
                            </div>
                            {openMenu &&
                                <div className='absolute top-8 right-0 z-10 border-1 border-gray-400 rounded-lg'>
                                    <ul className='bg-white border border-gray-200 divide-y divide-gray-100 rounded-lg shadow w-44'>
                                        <li onClick={() => { navigate('/myprofile'), setOpenMenu(false) }} className='flex items-center gap-2 py-2 px-3 hover:bg-[#5F6FFF] hover:text-white rounded-t-lg cursor-pointer'><FiUser className='text-lg' />My Profile</li>
                                        <li onClick={() => { navigate('/myappointments'), setOpenMenu(false) }} className='flex items-center gap-2 py-2 px-3 hover:bg-[#5F6FFF] hover:text-white cursor-pointer'><CiCalendarDate className='text-lg' />My Appointments</li>
                                        <li onClick={() => { handlelogout(), setOpenMenu(false) }} className='flex items-center gap-2 py-2 px-3 hover:bg-[#5F6FFF] hover:text-white rounded-b-lg cursor-pointer'><IoLogOutOutline className='text-lg' />Logout</li>
                                    </ul>
                                </div>
                            }
                        </div> :
                        <button onClick={() => navigate('/login')} className="bg-[#5F6FFF] text-white hover:!text-black py-2 px-4 sm:px-6 rounded hidden md:block transition-colors duration-300">LOG IN</button>
                    }
                    <CiMenuKebab className="md:hidden text-xl cursor-pointer transition-transform duration-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
                </div>
            </div>
            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white shadow-lg overflow-hidden animate-slide-down">
                    <div>
                        <ul className='flex flex-col items-center gap-3 font-medium py-4'>
                            {/* Menu items */}
                            {token ?
                                <> <NavLink onClick={() => { scrollTo(0, 0); setMobileMenuOpen(false) }} to='/' className={({ isActive }) => isActive ? "text-primary" : ""} >
                                    <li className='py-1 transition-all duration-300 hover:scale-105 hover:text-primary'>
                                        Home
                                    </li>
                                </NavLink>
                                    <NavLink onClick={() => { scrollTo(0, 0); setMobileMenuOpen(false) }} to='/doctors' className={({ isActive }) => isActive ? "text-primary" : ""} >
                                        <li className='py-1 transition-transform duration-200 hover:scale-105'>All Doctors</li>
                                    </NavLink>
                                    <NavLink onClick={() => { scrollTo(0, 0); setMobileMenuOpen(false) }} to='/about' className={({ isActive }) => isActive ? "text-primary" : ""} >
                                        <li className='py-1 transition-transform duration-200 hover:scale-105'>About</li>
                                    </NavLink>
                                    <NavLink onClick={() => { scrollTo(0, 0); setMobileMenuOpen(false) }} to='/contact' className={({ isActive }) => isActive ? "text-primary" : ""} >
                                        <li className='py-1 transition-transform duration-200 hover:scale-105'>Contact</li>
                                    </NavLink></> : ""}
                            {!token && (
                                <button onClick={() => { navigate('/login'); setMobileMenuOpen(false) }} className="bg-[#5F6FFF] text-white hover:!text-black py-2 px-6 rounded transition-all duration-300 mt-2 hover:scale-105" >
                                    Create Account
                                </button>
                            )}
                        </ul>
                    </div>
                </div >
            )}
        </>
    )
}

export default Navbar