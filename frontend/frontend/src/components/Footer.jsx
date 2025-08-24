import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets_frontend/assets"

const Footer = () => {
    const navigate = useNavigate();
    return (
        <>
            <div data-aos="zoom-in" className="md:mx-10">
                <div className="flex flex-col sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr] gap-8 sm:gap-10 md:gap-14 my-2 sm:my-10 mt-20 sm:mt-40">
                    {/* Left Side */}
                    <div className="order-1 sm:order-1 lg:order-1">
                        <img className='mb-4 w-40 sm:w-48' src={assets.logo} alt="Footer_Logo" />
                        <div className="flex flex-col gap-2 sm:gap-3">
                            <p className="w-full text-gray-800 text-sm sm:text-base font-medium">
                                Connecting patients with trusted healthcare professionals, our platform makes it easy to browse, book, and manage doctor appointments. Whether you're looking for general consultations or specialized care, we're here to simplify your healthcare journey. Available 24/7 to support your wellness needs.
                            </p>
                            <p className="w-full text-gray-800 text-sm sm:text-base font-medium">
                                Powered by technology, driven by care. Book doctor appointments effortlessly and take control of your health journey with just a few clicks.
                            </p>
                        </div>
                    </div>
                    {/* Middle Side */}
                    <div className="order-3 sm:order-2 lg:order-2">
                        <h1 className="text-xl sm:text-2xl font-medium mb-3 sm:mb-4 text-primary">Company</h1>
                        <ul className="flex flex-col gap-1 sm:gap-2">
                            <li onClick={() => { navigate('/'), scrollTo(0, 0) }} className="hover:text-primary cursor-pointer hover:font-medium text-sm sm:text-base">Home</li>
                            <li onClick={() => { navigate('/about'), scrollTo(0, 0) }} className="hover:text-primary cursor-pointer hover:font-medium text-sm sm:text-base">About Us</li>
                            <li onClick={() => { navigate('/contact'), scrollTo(0, 0) }} className="hover:text-primary cursor-pointer hover:font-medium text-sm sm:text-base">Contact Us</li>
                            <li onClick={() => { navigate('/terms&conditions'), scrollTo(0, 0) }} className="hover:text-primary cursor-pointer hover:font-medium text-sm sm:text-base">Terms & Conditions</li>
                            <li onClick={() => { navigate('/privacypolicy'), scrollTo(0, 0) }} className="hover:text-primary cursor-pointer hover:font-medium text-sm sm:text-base">Privacy Policy</li>
                        </ul>
                    </div>
                    {/* Right Side */}
                    <div className="order-2 sm:order-3 lg:order-3">
                        <h1 className="text-xl sm:text-2xl font-medium mb-3 sm:mb-4 text-primary">Get In Touch</h1>
                        <ul className="flex flex-col gap-1 sm:gap-2">
                            <li className="hover:text-primary cursor-pointer hover:font-medium text-sm sm:text-base">Mobile No : <span>+91 9638473047</span></li>
                            <li className="hover:text-primary cursor-pointer hover:font-medium text-sm sm:text-base">E-Mail : <span>chhipasahil163@gmail.com</span></li>
                            <li className="hover:text-primary cursor-pointer hover:font-medium text-sm sm:text-base">Address : <span>Ahmedabad, Gujarat, India.</span></li>
                        </ul>
                    </div>
                </div>
                {/* Copyright Section */}
                <div className="text-center my-3">
                    <hr className="mb-3 text-primary" />
                    <p className="text-gray-700 text-sm sm:text-base">Copyright © 2025 <span className="text-primary">Prescripto</span> - All rights reserved.</p>
                </div>
            </div>
        </>
    )
}

export default Footer