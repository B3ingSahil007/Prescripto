import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const RelatedDoctors = ({ speciality, docId }) => {
    const { doctors } = useContext(AppContext);
    const [relatedDoctors, setRelatedDoctors] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (doctors.length > 0 && speciality) {
            const doctorsData = doctors.filter((item) => item.speciality === speciality && item._id !== docId);
            setRelatedDoctors(doctorsData);
        }
    }, [doctors, speciality, docId]);

    return (
        <>
            <div data-aos="zoom-in" className='flex flex-col items-center gap-4 my-10 md:my-16 text-gray-800 mx-0 md:mx-10'>
                <h1 className='text-xl sm:text-3xl font-medium text-center'>Top Doctors In {speciality}</h1>
                <p className='w-full md:w-2/3 lg:w-1/3 text-center text-sm sm:text-base px-2 md:px-0'>
                    Simply browse through our extensive list of trusted doctors.
                </p>
                <div className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 pt-2 gap-y-4 sm:gap-y-6 w-full px-2 sm:px-0'>
                    {relatedDoctors.slice(0, 5).map((item, index) => (
                        <div 
                            onClick={() => { scrollTo(0, 0), navigate(`/appointment/${item._id}`) }} 
                            className='border !border-blue-300 rounded-xl overflow-hidden hover:translate-y-[-15px] transition-all duration-500 cursor-pointer' 
                            key={index}
                        >
                            <img className='bg-blue-100' src={item.image} alt={item.name} />
                            <div className='p-3 sm:p-4'>
                                <div className='flex items-center gap-2 text-xs sm:text-sm text-center text-green-500'>
                                    <p className='w-2 h-2 bg-green-500 rounded-full'></p>
                                    <p>Available</p>
                                </div>
                                <p className='text-gray-800 text-sm sm:text-base md:text-lg font-medium'>{item.name}</p>
                                <p className='text-gray-600 text-xs sm:text-sm'>{item.speciality}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <button 
                    onClick={() => { navigate('/doctors'), scrollTo(0, 0) }} 
                    className='bg-primary text-white py-2 px-10 sm:px-16 mt-3 rounded-full hover:scale-105 transition-all duration-300 text-sm sm:text-base'
                >
                    More
                </button>
            </div>
        </>
    )
}

export default RelatedDoctors