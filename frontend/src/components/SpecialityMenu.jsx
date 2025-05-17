import { Link } from "react-router-dom"
import { specialityData } from "../assets/assets_frontend/assets"

const SpecialityMenu = () => {
    return (
        <>
            {/* Speciality Menu */}
            <div data-aos="zoom-in" className='flex flex-col items-center gap-4 pt-28 pb-16 text-gray-800' id='speciality'>
                <h1 className='text-3xl font-medium'>Find By Speciality</h1>
                <p className='w-1/3 text-center text-base'>Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.</p>
                <div className='flex flex-wrap items-center sm:justify-center gap-4 pt-3 w-full overflow-scroll'>
                    {/* Speciality Cards */}
                    {specialityData.map((item, index) => (
                        <Link onClick={() => scrollTo(0, 0)} to={`/doctors/${item.speciality}`} key={index} className='flex flex-col items-center text-sm flex-shrink-0 hover:translate-y-[-15px] transition-all duration-500 cursor-pointer' >
                            <img className='w-16 sm:w-24 mb-2' src={item.image} alt={item.speciality} />
                            <p className='text-lg'>{item.speciality}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    )
}

export default SpecialityMenu
