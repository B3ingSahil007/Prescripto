import React, { useState } from 'react'
import { assets } from '../assets/assets_frontend/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { CgProfile } from "react-icons/cg";
import { IoIosArrowDown } from "react-icons/io";
import { FiUser } from "react-icons/fi";
import { CiCalendarDate } from "react-icons/ci";
import { IoLogOutOutline } from "react-icons/io5";

const Navbar = () => {
    const navigate = useNavigate();
    const [openMenu, setOpenMenu] = useState(false);
    const [token, setToken] = useState(true);
    const [userName, setUserName] = useState("Sahil Miyawala");

    return (
        <>
            <div className='flex sticky-top bg-white items-center justify-between text-sm py-4 px-6 border-b border-b-gray-400 shadow-2xl'>
                <img onClick={() => navigate('/')} className='w-44 cursor-pointer' src={assets.logo} alt="Logo_Image" />
                <ul className='hidden md:flex items-start gap-5 font-medium'>
                    <NavLink onClick={() => scrollTo(0, 0)} to='/'>
                        <li className='py-1'>Home</li>
                        <hr className='border-none outline-none h-0.5 bg-[#152dff] w-3/5 m-auto hidden' />
                    </NavLink>
                    <NavLink onClick={() => scrollTo(0, 0)} to='/doctors'>
                        <li className='py-1'>All Doctors</li>
                        <hr className='border-none outline-none h-0.5 bg-[#152dff] w-3/5 m-auto hidden' />
                    </NavLink>
                    <NavLink onClick={() => scrollTo(0, 0)} to='/about'>
                        <li className='py-1'>About</li>
                        <hr className='border-none outline-none h-0.5 bg-[#152dff] w-3/5 m-auto hidden' />
                    </NavLink>
                    <NavLink onClick={() => scrollTo(0, 0)} to='/contact'>
                        <li className='py-1'>Contact</li>
                        <hr className='border-none outline-none h-0.5 bg-[#152dff] w-3/5 m-auto hidden' />
                    </NavLink>
                </ul>
                <div className='flex items-center gap-4'>
                    {token ?
                        <div className='flex items-center cursor-pointer group relative'>
                            <div onClick={() => setOpenMenu(!openMenu)} className='flex items-center gap-2'>
                                <CgProfile className='w-6 h-6 rounded-full cursor-pointer' />
                                <p className='text-base'>{userName}</p>
                                <IoIosArrowDown className={`w-4 h-4 cursor-pointer ${openMenu ? 'rotate-180 transition-transform duration-300' : 'rotate-0 transition-transform duration-300'}`} />
                            </div>
                            {openMenu &&
                                <div className='absolute top-8 right-0 z-10 border-1 border-gray-400 rounded-lg'>
                                    <ul className='bg-white border border-gray-200 divide-y divide-gray-100 rounded-lg shadow w-44'>
                                        <li onClick={() => { navigate('/myprofile'), setOpenMenu(false) }} className='flex items-center gap-2 py-2 px-3 hover:bg-[#5F6FFF] hover:text-white rounded-t-lg cursor-pointer'><FiUser className='text-lg' />My Profile</li>
                                        <li onClick={() => { navigate('/myappointments'), setOpenMenu(false) }} className='flex items-center gap-2 py-2 px-3 hover:bg-[#5F6FFF] hover:text-white cursor-pointer'><CiCalendarDate className='text-lg' />My Appointments</li>
                                        <li onClick={() => { navigate('/login'), setToken(false) }} className='flex items-center gap-2 py-2 px-3 hover:bg-[#5F6FFF] hover:text-white rounded-b-lg cursor-pointer'><IoLogOutOutline className='text-lg' />Logout</li>
                                    </ul>
                                </div>
                            }
                        </div> :
                        <button onClick={() => navigate('/login')} className="bg-[#5F6FFF] text-white hover:!text-black py-2 px-6 rounded hidden md:block transition-colors duration-300">Create Account</button>
                    }
                </div>
            </div>
        </>
    )
}

export default Navbar
