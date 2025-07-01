import { useContext } from 'react'
import { AdminContext } from '../context/AdminContext';
import { NavLink } from 'react-router-dom';
import { FaHome } from "react-icons/fa";
import { CiCalendarDate } from "react-icons/ci";
import { CiSquarePlus } from "react-icons/ci";
import { LuUsers } from "react-icons/lu";
import { DoctorContext } from '../context/DoctorContext';

const Sidebar = () => {
    const { adminToken } = useContext(AdminContext);
    const { doctorToken } = useContext(DoctorContext);

    return (
        <>
            <div className='min-h-[91vh] bg-white border-r border-blue-300 sticky top-[1.75cm]'>
                {adminToken &&
                    <ul className='text-[#515151] mt-5'>
                        <NavLink className={({ isActive }) => `flex items-center gap-2 py-3.5 px-3 md:px-8 md:min-w-60 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''} `} to={'/admin'}>
                            <li className='flex items-center gap-2'><FaHome className='text-lg' /> Home</li>
                        </NavLink>
                        <NavLink className={({ isActive }) => `flex items-center gap-2 py-3.5 px-3 md:px-8 md:min-w-60 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''} `} to={'/all-appointments'}>
                            <li className='flex items-center gap-2'><CiCalendarDate className='text-lg' /> Appointments</li>
                        </NavLink>
                        <NavLink className={({ isActive }) => `flex items-center gap-2 py-3.5 px-3 md:px-8 md:min-w-60 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''} `} to={'/add-doctor'}>
                            <li className='flex items-center gap-2'><CiSquarePlus className='text-lg' /> Add Doctor</li>
                        </NavLink>
                        <NavLink className={({ isActive }) => `flex items-center gap-2 py-3.5 px-3 md:px-8 md:min-w-60 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''} `} to={'/doctor-list'}>
                            <li className='flex items-center gap-2'><LuUsers className='text-lg' /> Doctor List</li>
                        </NavLink>
                    </ul>
                }
                {doctorToken &&
                    <ul className='text-[#515151] mt-5'>
                        <NavLink className={({ isActive }) => `flex items-center gap-2 py-3.5 px-3 md:px-8 md:min-w-60 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''} `} to={'/doctor'}>
                            <li className='flex items-center gap-2'><FaHome className='text-lg' /> Dashboard</li>
                        </NavLink>
                        <NavLink className={({ isActive }) => `flex items-center gap-2 py-3.5 px-3 md:px-8 md:min-w-60 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''} `} to={'/doctor-appointments'}>
                            <li className='flex items-center gap-2'><CiCalendarDate className='text-lg' /> My Appointments</li>
                        </NavLink>
                        <NavLink className={({ isActive }) => `flex items-center gap-2 py-3.5 px-3 md:px-8 md:min-w-60 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''} `} to={'/doctor-profile'}>
                            <li className='flex items-center gap-2'><LuUsers className='text-lg' /> My Profile</li>
                        </NavLink>
                    </ul>
                }
            </div>
        </>
    )
}

export default Sidebar
