import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../context/AdminContext';

const DoctorList = () => {
    const { doctors, getAllDoctors, adminToken, changeAvailability } = useContext(AdminContext);

    useEffect(() => {
        if (adminToken) {
            getAllDoctors();
        }
    }, [adminToken]);

    return (
        <>
            <div className='m-5 max-h-[90vh] overflow-y-scroll'>
                <h1 className='text-2xl font-medium'>All Doctors</h1>
                <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6 justify-center'>
                    {doctors.map((item, index) => (
                        <div className='border border-blue-300 rounded-xl max-w-56 overflow-hidden cursor-pointer group' key={index}>
                            <img className='bg-blue-100 group-hover:bg-blue-200 transition-all duration-300' src={item.image} alt="Doctor_Image" />
                            <div className='p-3'>
                                <p className='text-lg font-medium'>{item.name}</p>
                                <p className='text-sm'>{item.speciality}</p>
                                <div className="mt-2 flex items-center gap-2">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={item.available}
                                            onChange={() => changeAvailability(item._id)}
                                        />
                                        <div className="w-14 h-7 flex items-center bg-gray-400 rounded-full px-1 peer-checked:bg-green-500 transition-colors duration-300 relative">
                                            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${item.available ? 'translate-x-7' : 'translate-x-0'
                                                }`}>
                                                {item.available ? (
                                                    <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                        <span className="ml-2 text-sm font-medium text-gray-600">
                                            Status: <span className={item.available ? "text-green-500" : "text-red-500"}>
                                                {item.available ? "Online" : "Offline"}
                                            </span>
                                        </span>
                                    </label>
                                </div>
                                <p className='text-sm'>Degree: {item.degree}</p>
                                <p className='text-sm'>Experience: {item.experience} Years</p>
                                <p className='text-sm'>Fees: {item.fees}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {/* <table className="table-auto border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Name</th>
                            <th className="border border-gray-300 px-4 py-2">Email</th>
                            <th className="border border-gray-300 px-4 py-2">Phone</th>
                            <th className="border border-gray-300 px-4 py-2">Speciality</th>
                            <th className="border border-gray-300 px-4 py-2">Degree</th>
                            <th className="border border-gray-300 px-4 py-2">Experience</th>
                            <th className="border border-gray-300 px-4 py-2">Fees</th>
                            <th className="border border-gray-300 px-4 py-2">About</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doctors.map((doctor) => (
                            <tr key={doctor._id}>
                                <td className="border border-gray-300 px-4 py-2">{doctor.name}</td>
                                <td className="border border-gray-300 px-4 py-2">{doctor.email}</td>
                                <td className="border border-gray-300 px-4 py-2">{doctor.phone}</td>
                                <td className="border border-gray-300 px-4 py-2">{doctor.speciality}</td>
                                <td className="border border-gray-300 px-4 py-2">{doctor.degree}</td>
                                <td className="border border-gray-300 px-4 py-2">{doctor.experience}</td>
                                <td className="border border-gray-300 px-4 py-2">{doctor.fees}</td>
                                <td className="border border-gray-300 px-4 py-2">{doctor.about}</td>
                            </tr>
                        ))}
                    </tbody>
                </table> */}
            </div>
        </>
    )
}

export default DoctorList
