import { assets } from "../assets/assets_frontend/assets"

const Footer = () => {
    return (
        <>
            <div data-aos="zoom-in" className="md:mx-10">
                <div className="flex flex-col sm:grid grid-cols-[2fr_1fr_1fr] gap-14 my-10 mt-40">
                    {/* Left Side */}
                    <div>
                        <img className='mb-4 w-48' src={assets.logo} alt="Footer_Logo" />
                        <div className="flex flex-col gap-3">
                            <p className="w-full text-gray-800 font-medium">Connecting patients with trusted healthcare professionals, our platform makes it easy to browse, book, and manage doctor appointments. Whether you're looking for general consultations or specialized care, we’re here to simplify your healthcare journey. Available 24/7 to support your wellness needs.</p>
                            <p className="w-full text-gray-800 font-medium">Powered by technology, driven by care. Book doctor appointments effortlessly and take control of your health journey with just a few clicks.</p>
                        </div>
                    </div>
                    {/* Middle Side */}
                    <div>
                        <h1 className="text-2xl font-medium mb-4 text-primary">Company</h1>
                        <ul className="flex flex-col gap-2">
                            <li className="hover:text-primary cursor-pointer hover:font-medium">Home</li>
                            <li className="hover:text-primary cursor-pointer hover:font-medium">About Us</li>
                            <li className="hover:text-primary cursor-pointer hover:font-medium">Contact Us</li>
                            <li className="hover:text-primary cursor-pointer hover:font-medium">Terms & Conditions</li>
                            <li className="hover:text-primary cursor-pointer hover:font-medium">Privacy Policy</li>
                        </ul>
                    </div>
                    {/* Right Side */}
                    <div>
                        <h1 className="text-2xl font-medium mb-4 text-primary">Get In Touch</h1>
                        <ul className="flex flex-col gap-2">
                            <li className="hover:text-primary cursor-pointer hover:font-medium">Mobile No : <span>+91 9638473047</span></li>
                            <li className="hover:text-primary cursor-pointer hover:font-medium">E-Mail : <span>chhipasahil163@gmail.com</span></li>
                            <li className="hover:text-primary cursor-pointer hover:font-medium">Address : <span>Ahmedabad, Gujarat, India.</span></li>
                        </ul>
                    </div>
                </div>
                {/* Copyright Section */}
                <div className="text-center my-3">
                    <hr className="mb-3 text-primary" />
                    <p className="text-gray-700">Copyright © 2025 Prescripto - All rights reserved.</p>
                </div>
            </div>
        </>
    )
}

export default Footer
