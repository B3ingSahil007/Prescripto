import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const TopDoctors = () => {
    const navigate = useNavigate();
    const { doctors } = useContext(AppContext)

    return (
        <>
            <div data-aos="zoom-in" className='flex flex-col items-center gap-4 my-2 sm:my-16 text-gray-800 md:mx-10'>
                <h1 className='text-3xl font-medium'>Top Doctors</h1>
                <p className='w-full text-center text-base'>Simply browse through our extensive list of trusted doctors.</p>
                <div className='grid grid-cols-1 sm:grid-cols-5 gap-4 pt-2 sm:pt-5 gap-y-6 px-3 sm:px-0 w-full'>
                    {doctors.slice(0, 10).map((item, index) => (
                        <div onClick={() => navigate(`/appointment/${item._id}`)} className='border !border-blue-300 rounded-xl overflow-hidden hover:translate-y-[-15px] transition-all duration-500 cursor-pointer' key={index}>
                            <img className='bg-blue-100' src={item.image} alt={item.name} />
                            <div className='p-4'>
                                <div className='flex items-center gap-2 text-sm text-center text-green-500'>
                                    <p className='w-2 h-2 bg-green-500 rounded-full'></p><p>Available</p>
                                </div>
                                <p className='text-gray-800 text-lg font-medium'>{item.name}</p>
                                <p className='text-gray-600 text-sm'>{item.speciality}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <button onClick={() => { navigate('/doctors'), scrollTo(0, 0) }} className='bg-primary text-white py-2 px-16 mt-3 sm:mt-10 rounded-full hover:scale-105 transition-all duration-300'>More</button>
            </div>
        </>
    )
}

export default TopDoctors
