import AOS from 'aos';
import 'aos/dist/aos.css';
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Doctors = () => {
    const { speciality } = useParams();
    const { doctors } = useContext(AppContext);
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const navigate = useNavigate();

    const applyFilter = () => {
        if (speciality) {
            setFilteredDoctors(doctors.filter((item) => item.speciality === speciality));
        } else {
            setFilteredDoctors(doctors);
        }
    };

    const specialities = [
        { label: "All Doctors", value: "" },
        { label: "General Physician", value: "GeneralPhysician" },
        { label: "Gynecologist", value: "Gynecologist" },
        { label: "Dermatologist", value: "Dermatologist" },
        { label: "Pediatricians", value: "Pediatricians" },
        { label: "Neurologist", value: "Neurologist" },
        { label: "Gastroenterologist", value: "Gastroenterologist" },
    ];

    useEffect(() => {
        AOS.init({
            duration: 1000,
            delay: 100,
            offset: 200
        });
        applyFilter();
    }, [doctors, speciality]);

    useEffect(() => {
        AOS.refresh();
    }, [filteredDoctors]);

    return (
        <>
            <div className="flex flex-col items-center my-3">
                {speciality ? (
                    <p className="text-3xl font-medium text-gray-600">
                        Browse through our extensive list of trusted doctors for {speciality}.
                    </p>
                ) : (
                    <p className="text-3xl font-medium text-gray-600">
                        Browse through our extensive list of trusted doctors.
                    </p>
                )}
                <div data-aos="zoom-in" className="flex flex-col sm:flex-row items-start gap-5 mt-10">
                    {/* Filter Sidebar */}
                    <div className="flex flex-col gap-3 text-sm">
                        {specialities.map(({ label, value }, index) => (
                            <p
                                key={index}
                                onClick={() => navigate(value ? `/doctors/${value}` : "/doctors")}
                                className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-primary rounded transition-all cursor-pointer hover:bg-primary/60 hover:text-white ${speciality === value ? "bg-primary/50 text-white" : ""} `}
                            >
                                {label}
                            </p>
                        ))}
                    </div>
                    <div className="w-full pr-2">
                        <div key={speciality || "all"} data-aos="fade-up" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 gap-y-6">
                            {filteredDoctors.length === 0 && (
                                <p className="text-gray-500 text-lg col-span-full">
                                    No doctors found for this speciality.
                                </p>
                            )}
                            {filteredDoctors.map((item, index) => (
                                <div onClick={() => { scrollTo(0, 0), navigate(`/appointment/${item._id}`) }} className='border !border-blue-300 rounded-xl overflow-hidden hover:translate-y-[-15px] transition-all duration-500 cursor-pointer' key={index}>
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
                    </div>
                </div>
            </div>
        </>
    );
};

export default Doctors;
