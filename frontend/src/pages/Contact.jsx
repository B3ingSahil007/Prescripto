import { assets } from '../assets/assets_frontend/assets';

const Contact = () => {
    return (
        <>
            <div className='my-4'>
                <div data-aos="fade-down" className="text-center text-2xl text-gray-700">
                    <p>CONTACT <span className="text-primary font-medium">US</span></p>
                </div>
                <div className="my-5 flex flex-col justify-center md:flex-row gap-4 sm:gap-80 mb-28 text-sm">
                    <img data-aos="fade-right" src={assets.contact_image} alt="Contact_Image" className="w-full max-w-[360px]" />
                    <div data-aos="fade-left" className="text-lg flex flex-col justify-center items-start gap-3 sm:gap-6 text-gray-700">
                        <p className='hover:text-primary hover:font-semibold'>Phone : +91 9638473047</p>
                        <p className='hover:text-primary hover:font-semibold'>Email : chhipasahil163@gmail.com</p>
                        <p className='hover:text-primary hover:font-semibold'>Location : Ahmedabad, Gujarat, India</p>
                        <p className='hover:text-primary hover:font-semibold'>Hours : Mon - Sun, 10 AM - 7 PM</p>
                    </div>
                </div>
                <div data-aos="fade-up" className='flex flex-col items-center'>
                    <p className="text-lg sm:text-xl font-medium text-gray-700">Get in touch with us for any inquiries or feedback. We value your input and look forward to connecting with you.</p>
                    <p className="text-lg text-gray-500 my-3">We’d love to hear from you. Please fill out the form below.</p>
                    <div className="w-full md:w-1/2 flex justify-center">
                        <form className="w-full flex flex-col gap-3">
                            <input type="text" placeholder="Your Name" className="border !border-blue-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-primary" />
                            <input type="email" placeholder="Your Email" className="border !border-blue-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-primary" />
                            <input type="text" placeholder="Subject" className="border !border-blue-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-primary" />
                            <textarea rows="3" placeholder="Your Message" className="border !border-blue-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-primary" ></textarea>
                            <button type="submit" className="bg-white border !border-blue-300 text-primary hover:text-black hover:!bg-blue-100 py-2 sm:py-3 rounded transition duration-300 w-40" >Send Message </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Contact;
