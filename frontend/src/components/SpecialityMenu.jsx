import { Link } from "react-router-dom"
import { specialityData } from "../assets/assets_frontend/assets"

const SpecialityMenu = () => {
    return (
        <>
            {/* Speciality Menu */}
            <div data-aos="zoom-in" className='flex flex-col items-center gap-4 pt-2 sm:pt-28 pb-16 text-gray-800' id='speciality'>
                <h1 className='text-3xl font-medium'>Find By Speciality</h1>
                <p className='w-full sm:w-1/3 text-center text-base'>Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.</p>
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pt-3 w-3/4'>
                    {/* Speciality Cards */}
                    {specialityData.map((item, index) => (
                        <Link onClick={() => scrollTo(0, 0)} to={`/doctors/${item.speciality}`} key={index} className='flex flex-col items-center text-sm hover:translate-y-[-15px] transition-all duration-500 cursor-pointer' >
                            <img className='w-16 sm:w-20 md:w-24 mb-2' src={item.image} alt={item.speciality} />
                            <p className='text-sm sm:text-base md:text-lg text-center'>{item.speciality}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    )
}

export default SpecialityMenu
