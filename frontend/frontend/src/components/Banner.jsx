import { useEffect, useState } from "react";
import { assets } from "../assets/assets_frontend/assets"
import { useNavigate } from "react-router-dom";

const Banner = () => {
    const navigate = useNavigate();
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        setAnimate(true);
    }, []);

    return (
        <>
            <div className='flex md:flex-row flex-col items-center justify-between bg-primary rounded-lg px-6 sm:px-10 md:px-14 lg:px-12 my-20 md:mx-10'>
                {/* Left Side */}
                <div data-aos="fade-right" className="flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5 m-auto">
                    <div className='text-xl sm:text-2xl md:text-3xl lg:text-5xl text-white font-semibold flex flex-col gap-y-4'>
                        <p>Book Appointment</p>
                        <p>With 100+ Trusted Doctors</p>
                    </div>
                    <button onClick={() => { navigate('/login'), scrollTo(0, 0) }} className='bg-white text-primary text-sm sm:text-base py-2 px-8 mt-4 rounded-full hover:scale-105 transition-all duration-300'>Create Account</button>
                </div>
                {/* Right Side */}
                <div data-aos="fade-left" className="md:w-1/2 lg:w-[370px]">
                    <img className='w-full bottom-0 right-0 max-w-md' src={assets.appointment_img} alt="Appointment_Image" />
                </div>
            </div>
        </>
    )
}

export default Banner
