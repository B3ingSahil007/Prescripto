import { useEffect, useState } from 'react';
import { assets } from '../assets/assets_frontend/assets';
import { FaArrowRight } from "react-icons/fa6";

const Header = () => {
    const [animate, setAnimate] = useState(false);

    const scrollToSpeciality = () => {
        const section = document.getElementById("speciality");
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
    };

    useEffect(() => {
        setAnimate(true);
    }, []);

    return (
        <div className='flex flex-col md:flex-row flex-wrap items-center justify-between bg-primary rounded-lg px-6 md:px-10 lg:px-20 my-5 overflow-hidden'>

            {/* Left Side */}
            <div className={`md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto ${animate ? 'animate-slide-in-left' : ''}`}>
                <h1 className='text-2xl md:text-4xl lg:text-6xl text-white font-semibold'>
                    Book Appointment <br />With Trusted Doctors
                </h1>
                <div className='flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light'>
                    <img className='w-28' src={assets.group_profiles} alt="Group_Profiles_Image" />
                    <p className='text-base lg:text-lg'>
                        Simply browse through our extensive list of trusted doctors,<br className='hidden sm:block' />schedule your appointment hassle free.
                    </p>
                </div>
                <div onClick={scrollToSpeciality} className='group flex items-center gap-2 bg-white py-2 sm:py-3 px-3 sm:px-8 rounded-full text-primary hover:scale-105 transition-all duration-300 cursor-pointer' >
                    <button>Book Appointment</button>
                    <FaArrowRight className='mt-1 transform transition-transform duration-300' />
                </div>
            </div>

            {/* Right Side */}
            <div className={`md:w-1/2 ${animate ? 'animate-slide-in-right' : ''}`}>
                <img className='w-full h-auto rounded-lg object-contain' src={assets.header_img} alt="Header_Image" />
            </div>
        </div>
    );
};

export default Header;
