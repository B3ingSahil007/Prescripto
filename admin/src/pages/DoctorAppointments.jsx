import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { DoctorContext } from "../context/DoctorContext";
import { FaTimes, FaEye, FaCheck } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";

const DoctorAppointments = () => {
    const { doctorToken, getAppointments, appointments, cancelAppointment, completeAppointment } = useContext(DoctorContext);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [actionType, setActionType] = useState(null); // 'complete' or 'cancel'
    const [appointmentToConfirm, setAppointmentToConfirm] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalAppointments, setTotalAppointments] = useState(0);

    useEffect(() => {
        if (doctorToken) {
            getAppointments();
        }
    }, [doctorToken]);

    //   Format DOB in dd-mm-yyyy format
    const formatDOB = (dob) => {
        if (!dob) return "N/A";
        const date = new Date(dob);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    // Function to format the date from "27_6_2025" to "27 June 2025"
    const formatDate = (dateStr) => {
        const [day, month, year] = dateStr.split("_");
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return `${day} ${monthNames[parseInt(month) - 1]} ${year}`;
    };

    // Function to calculate age from DOB
    const calculateAge = (dob) => {
        if (!dob) return "N/A";
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const openModal = (appointment) => {
        setSelectedAppointment(appointment);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedAppointment(null);
    };

    const openConfirmationModal = (type, appointment) => {
        setActionType(type);
        setAppointmentToConfirm(appointment);
        setIsConfirmationModalOpen(true);
    };

    const closeConfirmationModal = () => {
        setIsConfirmationModalOpen(false);
        setActionType(null);
        setAppointmentToConfirm(null);
    };

    const handleConfirmAction = () => {
        if (actionType === "complete") {
            completeAppointment(appointmentToConfirm._id);
        } else if (actionType === "cancel") {
            cancelAppointment(appointmentToConfirm._id);
        }
        closeConfirmationModal();
    };

    useEffect(() => {
        if (doctorToken) {
            const fetchAppointments = async () => {
                const pagination = await getAppointments(currentPage, itemsPerPage);
                if (pagination) {
                    setTotalPages(pagination.pages);
                    setTotalAppointments(pagination.total); // Set total appointments count
                }
            };
            fetchAppointments();
        }
    }, [doctorToken, currentPage, itemsPerPage]);

    return (
        <div className="container mx-auto w-[85%] px-4 py-4">
            <h1 className="text-2xl font-bold mb-6">My Appointments</h1>

            <div className="overflow-x-auto rounded-lg">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="border-b bg-blue-300">
                        <tr>
                            <th className="py-3 px-2 sm:px-4">Patient</th>
                            <th className="py-3 px-2 sm:px-4">Age</th>
                            <th className="py-3 px-2 sm:px-4 hidden sm:table-cell">Gender</th>
                            <th className="py-3 px-2 sm:px-4 hidden md:table-cell">Address</th>
                            <th className="py-3 px-2 sm:px-4">Date</th>
                            <th className="py-3 px-2 sm:px-4">Time</th>
                            <th className="py-3 px-2 sm:px-4">Fees</th>
                            <th className="py-3 px-2 sm:px-4">Status</th>
                            <th className="py-3 px-2 sm:px-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {appointments?.map((appointment) => (
                            <tr key={appointment._id} className="hover:bg-gray-50 border-b">
                                <td className="py-3 px-2 sm:px-4">
                                    <div className="flex items-center">
                                        <img src={appointment.userData.image} alt={appointment.userData.firstname} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full mr-2 sm:mr-3" />
                                        <div>
                                            <p className="font-medium text-sm sm:text-base">
                                                {appointment.userData.firstname} {appointment.userData.lastname}
                                            </p>
                                            <p className="text-xs sm:text-sm text-gray-500">{appointment.userData.phone}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 px-2 sm:px-4">
                                    <div>
                                        <p className="text-sm sm:text-base">{calculateAge(appointment.userData.dob)} years</p>
                                        <p className="text-xs text-gray-500">{formatDOB(appointment.userData.dob) || "N/A"}</p>
                                    </div>
                                </td>
                                <td className="py-3 px-2 sm:px-4 hidden sm:table-cell">{appointment.userData.gender || "N/A"}</td>
                                <td className="py-3 px-2 sm:px-4 hidden md:table-cell">
                                    <div className="max-w-xs truncate">{appointment.userData.address.line1 + "..." || "N/A"}</div>
                                </td>
                                <td className="py-3 px-2 sm:px-4">
                                    <span className="text-sm sm:text-base">{formatDate(appointment.slotDate)}</span>
                                </td>
                                <td className="py-3 px-2 sm:px-4">
                                    <span className="text-sm sm:text-base">{appointment.slotTime}</span>
                                </td>
                                <td className="py-3 px-2 sm:px-4">
                                    <div>
                                        <span className="text-sm sm:text-base">₹{appointment.amount}</span>
                                        <p className="text-xs text-gray-500">{appointment.payment === 'true' ? 'Paid' : 'Cash'}</p>
                                    </div>
                                </td>
                                <td className="py-3 px-2 sm:px-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${appointment.cancelled ? "bg-red-100 text-red-800" : appointment.isCompleted ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
                                        {appointment.cancelled ? "Cancelled" : appointment.isCompleted ? "Completed" : "Upcoming"}
                                    </span>
                                </td>
                                <td className="py-3 px-1 sm:px-2">
                                    <div className="flex space-x-1 sm:space-x-2">
                                        <button className="text-blue-500 hover:bg-blue-300 hover:text-black rounded transition duration-300 p-1 sm:p-2" onClick={() => openModal(appointment)} title="View Details">
                                            <FaEye className="text-sm sm:text-base" />
                                        </button>
                                        {appointment.cancelled ? (
                                            <p className="text-red-500 items-center p-1 flex text-xs sm:text-sm">Cancelled</p>
                                        ) : appointment.isCompleted ? (
                                            <p className="text-green-500 items-center p-1 flex text-xs sm:text-sm">Completed</p>
                                        ) : (
                                            <>
                                                <button
                                                    className="text-green-500 hover:bg-green-300 hover:text-black rounded transition duration-300 p-1 sm:p-2"
                                                    onClick={() => {
                                                        openConfirmationModal("complete", appointment);
                                                    }}
                                                    title="Mark as Complete">
                                                    <FaCheck className="text-sm sm:text-base" />
                                                </button>
                                                <button
                                                    className="text-red-500 hover:bg-red-300 hover:text-black rounded transition duration-300 p-1 sm:p-2"
                                                    onClick={() => {
                                                        openConfirmationModal("cancel", appointment);
                                                    }}
                                                    title="Cancel Appointment">
                                                    <RxCrossCircled className="text-sm sm:text-base" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="mt-4 flex justify-between items-center">
                    <div>
                        <span className="text-sm text-gray-700">
                            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                            {Math.min(currentPage * itemsPerPage, totalAppointments)} of {totalAppointments} appointments
                        </span>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                        >
                            Previous
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`px-3 py-1 rounded ${currentPage === pageNum ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        {totalPages > 5 && currentPage < totalPages - 2 && (
                            <span className="px-3 py-1">...</span>
                        )}
                        {totalPages > 5 && currentPage < totalPages - 2 && (
                            <button
                                onClick={() => setCurrentPage(totalPages)}
                                className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                            >
                                {totalPages}
                            </button>
                        )}
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                        >
                            Next
                        </button>
                    </div>
                    <div>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                setItemsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                            className="px-2 py-1 border rounded"
                        >
                            <option value="5">5 per page</option>
                            <option value="10">10 per page</option>
                            <option value="20">20 per page</option>
                            <option value="50">50 per page</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Modal for viewing appointment details - keep exactly the same */}
            {isModalOpen && selectedAppointment && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div data-aos="zoom-in" className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Appointment Details</h2>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                                <FaTimes size={24} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Patient Information</h3>
                                <div className="flex items-center mb-4">
                                    <img src={selectedAppointment.userData.image} alt={selectedAppointment.userData.firstname} className="w-16 h-16 rounded-full mr-4" />
                                    <div>
                                        <p className="font-medium text-lg">
                                            {selectedAppointment.userData.firstname} {selectedAppointment.userData.lastname}
                                        </p>
                                        <p className="text-gray-600">{selectedAppointment.userData.phone}</p>
                                        <p className="text-gray-600">{selectedAppointment.userData.email}</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p>
                                        <span className="font-medium">Age:</span> {calculateAge(selectedAppointment.userData.dob)} years
                                    </p>
                                    <p>
                                        <span className="font-medium">DOB:</span> {selectedAppointment.userData.dob || "N/A"}
                                    </p>
                                    <p>
                                        <span className="font-medium">Gender:</span> {selectedAppointment.userData.gender || "N/A"}
                                    </p>
                                    <p>
                                        <span className="font-medium">Address:</span> {selectedAppointment.userData.address.line1 + ", " + selectedAppointment.userData.address.line2 || "N/A"}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-2">Appointment Details</h3>
                                <div className="space-y-2">
                                    <p>
                                        <span className="font-medium">Date:</span> {formatDate(selectedAppointment.slotDate)}
                                    </p>
                                    <p>
                                        <span className="font-medium">Time:</span> {selectedAppointment.slotTime}
                                    </p>
                                    <p>
                                        <span className="font-medium">Fees:</span> ₹{selectedAppointment.amount}
                                    </p>
                                    <p>
                                        <span className="font-medium">Status:</span>
                                        <span className={`ml-2 px-2 py-1 rounded-full text-xs ${selectedAppointment.cancelled ? "bg-red-100 text-red-800" : selectedAppointment.isCompleted ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
                                            {selectedAppointment.cancelled ? "Cancelled" : selectedAppointment.isCompleted ? "Completed" : "Upcoming"}
                                        </span>
                                    </p>
                                </div>

                                <h3 className="text-lg font-semibold mt-4 mb-2">Doctor Information</h3>
                                <div className="flex items-center">
                                    <img src={selectedAppointment.docData.image} alt={selectedAppointment.docData.name} className="w-16 h-16 rounded-full mr-4" />
                                    <div>
                                        <p className="font-medium">{selectedAppointment.docData.name}</p>
                                        <p className="text-gray-600">{selectedAppointment.docData.speciality}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button onClick={closeModal} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal - keep exactly the same */}
            {isConfirmationModalOpen && appointmentToConfirm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div data-aos="zoom-in" className="bg-white rounded-lg p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{actionType === "complete" ? "Complete Appointment" : "Cancel Appointment"}</h2>
                            <button onClick={closeConfirmationModal} className="text-gray-500 hover:text-gray-700">
                                <FaTimes size={20} />
                            </button>
                        </div>

                        <div className="mb-4">
                            <div className="flex items-center mb-3">
                                <img src={appointmentToConfirm.userData.image} alt={appointmentToConfirm.userData.firstname} className="w-12 h-12 rounded-full mr-3" />
                                <div>
                                    <p className="font-medium">
                                        {appointmentToConfirm.userData.firstname} {appointmentToConfirm.userData.lastname}
                                    </p>
                                    <p className="text-sm text-gray-600">{appointmentToConfirm.userData.phone}</p>
                                </div>
                            </div>

                            <div className="space-y-1 text-sm">
                                <p>
                                    <span className="font-medium">Date:</span> {formatDate(appointmentToConfirm.slotDate)}
                                </p>
                                <p>
                                    <span className="font-medium">Time:</span> {appointmentToConfirm.slotTime}
                                </p>
                                <p>
                                    <span className="font-medium">Fees:</span> ₹{appointmentToConfirm.amount}
                                </p>
                            </div>
                        </div>

                        <p className="mb-4 text-gray-700">Are you sure you want to {actionType === "complete" ? "mark this appointment as completed?" : "cancel this appointment?"}</p>

                        <div className="flex justify-between space-x-4">
                            <button onClick={closeConfirmationModal} className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-400 bg-gray-300 transition-all duration-300">
                                No
                            </button>
                            <button onClick={handleConfirmAction} className={`px-4 py-2 text-white rounded transition-all duration-300 ${actionType === "complete" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"}`}>
                                Yes, {actionType === "complete" ? "Complete" : "Cancel"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoctorAppointments;
