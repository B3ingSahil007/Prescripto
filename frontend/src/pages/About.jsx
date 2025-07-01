import { assets } from '../assets/assets_frontend/assets'

const whyChooseUsData = [
    {
        title: 'Efficiency',
        description: 'Streamlined appointment scheduling that fits into your busy lifestyle.',
    },
    {
        title: 'Convenience',
        description: 'Access to a network of trusted healthcare professionals in your area.',
    },
    {
        title: 'Personalization',
        description: 'Tailored recommendations and reminders to help you stay on top of your health.',
    },
    {
        title: '24/7 Accessibility',
        description: 'Book appointments anytime, anywhere — no need to wait for office hours.',
    },
    {
        title: 'Verified Doctors',
        description: 'Connect only with certified and experienced medical professionals.',
    },
    {
        title: 'Secure & Private',
        description: 'Your health data is encrypted and protected with the highest privacy standards.',
    },
]

const About = () => {
    return (
        <>
            <div className='m-0 sm:mx-10'>
                <div data-aos="fade-down" className='text-center text-2xl pt-10 text-gray-700'>
                    <p>ABOUT <span className='text-primary font-medium'>US</span></p>
                </div>
                <div className='my-5 flex flex-col md:flex-row gap-12'>
                    <img data-aos="fade-right" className='w-full md:max-w-[360px]' src={assets.about_image} alt="About_Image" />
                    <div data-aos="fade-left" className='flex flex-col gap-6 justify-center md:2/4 text-gray-700'>
                        <p>Welcome to <span className='text-primary'>Prescripto</span>, your trusted partner in managing your healthcare needs conveniently and efficiently. At <span className='text-primary'>Prescripto</span>, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.</p>
                        <p>At <span className='text-primary'>Prescripto</span>, we are committed to making healthcare accessible, efficient, and patient-friendly. Our platform bridges the gap between patients and trusted medical professionals by offering a seamless online appointment booking experience. Whether you're looking for a <span className='font-semibold'>General Physician</span> for routine checkups, a <span className='font-semibold'>Gynecologist</span> for women’s health, a <span className='font-semibold'>Dermatologist</span> for skin concerns, a <span className='font-semibold'>Pediatrician</span> for your child’s care, a <span className='font-semibold'>Neurologist</span> for nervous system issues, or a <span className='font-semibold'>Gastroenterologist</span> for digestive health — we’ve got you covered. Our mission is to empower individuals and families with the tools they need to take control of their health through timely appointments, verified doctor profiles, and a smooth, user-friendly interface. Your well-being is our top priority.</p>
                        <b>Our <span className='text-primary'>Vision</span> :</b>
                        <p>At <span className='text-primary'>Prescripto</span>, our vision is to revolutionize the way people access healthcare by creating a reliable, user-friendly platform for booking appointments with trusted medical professionals. We aim to simplify the healthcare journey by connecting patients with specialists across various fields — including General Physicians, Gynecologists, Dermatologists, Pediatricians, Neurologists, and Gastroenterologists. By harnessing technology, we strive to ensure timely care, improve health outcomes, and make quality medical services just a few clicks away for everyone.</p>
                    </div>
                </div>
                <div data-aos="fade-up" className='text-center text-2xl my-10 text-gray-700'>
                    <p>WHY CHOOSE <span className='text-primary font-semibold'>US</span> :</p>
                </div>
                <div data-aos="fade-up" className='grid md:grid-cols-3 gap-4 mb-20'>
                    {whyChooseUsData.map((item, index) => (
                        <div key={index} className='border !border-blue-300 rounded-2xl px-3 sm:px-5 md:px-16 py-3 sm:py-16 flex flex-col gap-2 hover:bg-blue-100 transition-all duration-300 cursor-pointer' >
                            <b className='text-xl'> {item.title}:</b>
                            <p>{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
export default About
