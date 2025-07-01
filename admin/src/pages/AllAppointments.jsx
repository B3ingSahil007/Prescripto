import { useContext, useEffect, useState } from 'react';
import { AdminContext } from '../context/AdminContext';
import { FaEye } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";

const AllAppointments = () => {
    const { adminToken, appointments, getAllAppointments, cancelAppointment } = useContext(AdminContext);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [appointmentToCancel, setAppointmentToCancel] = useState(null);

    useEffect(() => {
        if (adminToken) {
            getAllAppointments();
        }
    }, [adminToken]);

    // Format date (assuming slotDate is in format "DD_MM_YYYY")
    const formatDate = (slotDate) => {
        if (!slotDate) return 'N/A';
        const [day, month, year] = slotDate.split('_');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${day} ${months[parseInt(month) - 1]}, ${year}`;
    };

    // Calculate age from date of birth (assuming userData.dob exists)
    const calculateAge = (dob) => {
        if (!dob) return 'N/A';
        const birthDate = new Date(dob);
        const diff = Date.now() - birthDate.getTime();
        const ageDate = new Date(diff);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    // Status badge component
    const StatusBadge = ({ status }) => {
        const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";

        if (status === 'cancelled') {
            return <span className={`${baseClasses} bg-red-100 text-red-800`}>Cancelled</span>;
        } else if (status === 'completed') {
            return <span className={`${baseClasses} bg-green-100 text-green-800`}>Completed</span>;
        } else {
            return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>Upcoming</span>;
        }
    };

    const openModal = (appointment) => {
        setSelectedAppointment(appointment);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedAppointment(null);
    };

    const openCancelModal = (appointmentId) => {
        const appointment = appointments.find(app => app._id === appointmentId);
        setAppointmentToCancel(appointment);
        setIsCancelModalOpen(true);
    };

    const closeCancelModal = () => {
        setIsCancelModalOpen(false);
        setAppointmentToCancel(null);
    };

    const handleConfirmCancel = () => {
        if (appointmentToCancel) {
            cancelAppointment(appointmentToCancel._id);
            closeCancelModal();
        }
    };

    return (
        <div className='w-full max-w-8xl mx-auto p-4 sm:p-6'>
            <h1 className='text-2xl font-semibold text-gray-800 mb-6'>All Patient's Booked Appointments</h1>

            <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
                <div className='max-h-[70vh] overflow-y-auto'>
                    <table className='min-w-full divide-y divide-gray-200 text-center'>
                        <thead className='bg-blue-300 text-xs font-medium uppercase tracking-wider'>
                            <tr>
                                <th scope='col' className='px-2 py-3'>
                                    Sr. No
                                </th>
                                <th scope='col' className='px-4 py-3'>
                                    Patient
                                </th>
                                <th scope='col' className='px-4 py-3'>
                                    Age
                                </th>
                                <th scope='col' className='px-4 py-3'>
                                    Gender
                                </th>
                                <th scope='col' className='px-4 py-3'>
                                    Number
                                </th>
                                <th scope='col' className='px-4 py-3'>
                                    Date & Time
                                </th>
                                <th scope='col' className='px-4 py-3'>
                                    Doctor
                                </th>
                                <th scope='col' className='px-4 py-3'>
                                    Fees
                                </th>
                                <th scope='col' className='px-4 py-3'>
                                    Status
                                </th>
                                <th scope='col' className='px-4 py-3'>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                            {appointments.length === 0 ? (
                                <tr>
                                    <td colSpan='10' className='px-4 py-6 text-center text-sm text-gray-500'>
                                        No appointments found
                                    </td>
                                </tr>
                            ) : (
                                appointments.map((appointment, index) => (
                                    <tr key={appointment._id} className='hover:bg-gray-50'>
                                        <td className='px-2 py-2 whitespace-nowrap text-sm text-gray-500'>
                                            {index + 1}
                                        </td>
                                        <td className='px-2 py-2 whitespace-nowrap'>
                                            <div className='items-center'>
                                                <div>
                                                    <div className='text-sm font-medium text-gray-900'>
                                                        {appointment.userData?.firstname || 'N/A'} {appointment.userData?.lastname || 'N/A'}
                                                    </div>
                                                    <div className='text-xs text-gray-500'>
                                                        {appointment.userData?.email || 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='px-2 py-2 whitespace-nowrap text-sm text-gray-500'>
                                            <div className='text-sm font-medium text-gray-900'>
                                                {calculateAge(appointment.userData?.dob)}
                                            </div>
                                            <div className='text-sm'>
                                                {appointment.userData?.dob || 'N/A'}
                                            </div>
                                        </td>
                                        <td className='px-2 py-2 whitespace-nowrap text-sm text-gray-500'>
                                            {appointment.userData?.gender || 'N/A'}
                                        </td>
                                        <td className='px-2 py-2 whitespace-nowrap text-sm text-gray-500'>
                                            {appointment.userData?.phone || 'N/A'}
                                        </td>
                                        <td className='px-2 py-2 whitespace-nowrap'>
                                            <div className='text-sm font-medium text-gray-900'>
                                                {formatDate(appointment.slotDate)}
                                            </div>
                                            <div className='text-xs text-gray-500'>
                                                {appointment.slotTime}
                                            </div>
                                        </td>
                                        <td className='px-2 py-2 whitespace-nowrap'>
                                            <div className='text-sm font-medium text-gray-900'>
                                                {appointment.docData?.name || 'N/A'}
                                            </div>
                                            <div className='text-xs text-gray-500'>
                                                {appointment.docData?.speciality || 'N/A'}
                                            </div>
                                        </td>
                                        <td className='px-2 py-2 whitespace-nowrap text-sm font-medium text-gray-900'>
                                            ₹{appointment.docData?.fees || '0'}
                                        </td>
                                        <td className='px-2 py-2 whitespace-nowrap'>
                                            <StatusBadge status={
                                                appointment.cancelled ? 'cancelled' :
                                                    appointment.isCompleted ? 'completed' : 'upcoming'
                                            } />
                                        </td>
                                        <td className='px-2 py-2 whitespace-nowrap text-lg font-medium flex justify-center gap-2'>
                                            <button
                                                onClick={() => openModal(appointment)}
                                                className='text-blue-500 hover:bg-blue-300 hover:text-black rounded translate duration-300 p-2'
                                            >
                                                <FaEye />
                                            </button>
                                            {!appointment.cancelled && !appointment.isCompleted && (
                                                <button
                                                    onClick={() => openCancelModal(appointment._id)}
                                                    className='text-red-500 hover:bg-red-300 hover:text-black rounded translate duration-300 p-2'
                                                >
                                                    <RxCrossCircled />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Appointment Details Modal */}
            {isModalOpen && selectedAppointment && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div data-aos="zoom-in" className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-start border-b pb-4">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Appointment Details
                                </h3>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Patient Information */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-lg mb-3 text-gray-800">Patient Information</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm text-gray-500">Name</p>
                                            <p className="font-medium">
                                                {selectedAppointment.userData?.firstname} {selectedAppointment.userData?.lastname}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="font-medium">{selectedAppointment.userData?.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Phone</p>
                                            <p className="font-medium">{selectedAppointment.userData?.phone}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Date of Birth</p>
                                            <p className="font-medium">
                                                {selectedAppointment.userData?.dob} (Age: {calculateAge(selectedAppointment.userData?.dob)})
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Gender</p>
                                            <p className="font-medium">{selectedAppointment.userData?.gender}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Address</p>
                                            <p className="font-medium">
                                                {selectedAppointment.userData?.address?.line1}<br />
                                                {selectedAppointment.userData?.address?.line2}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Appointment Information */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-lg mb-3 text-gray-800">Appointment Information</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <p className="text-sm text-gray-500">Appointment ID</p>
                                            <p className="font-medium">{selectedAppointment._id}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Date & Time</p>
                                            <p className="font-medium">
                                                {formatDate(selectedAppointment.slotDate)} at {selectedAppointment.slotTime}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Status</p>
                                            <div className="mt-1">
                                                <StatusBadge status={
                                                    selectedAppointment.cancelled ? 'cancelled' :
                                                        selectedAppointment.isCompleted ? 'completed' : 'upcoming'
                                                } />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Booked On</p>
                                            <p className="font-medium">
                                                {new Date(selectedAppointment.date).toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Payment Status</p>
                                            <p className="font-medium">
                                                {selectedAppointment.payment ? 'Paid' : 'Pending'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Amount Paid</p>
                                            <p className="font-medium">₹{selectedAppointment.amount}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Doctor Information */}
                                <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                                    <h4 className="font-medium text-lg mb-3 text-gray-800">Doctor Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Name</p>
                                            <p className="font-medium">{selectedAppointment.docData?.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Speciality</p>
                                            <p className="font-medium">{selectedAppointment.docData?.speciality}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Qualification</p>
                                            <p className="font-medium">{selectedAppointment.docData?.degree}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Experience</p>
                                            <p className="font-medium">{selectedAppointment.docData?.experience} years</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Consultation Fee</p>
                                            <p className="font-medium">₹{selectedAppointment.docData?.fees}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Availability</p>
                                            <p className="font-medium">
                                                {selectedAppointment.docData?.available ? 'Available' : 'Not Available'}
                                            </p>
                                        </div>
                                        <div className="md:col-span-3">
                                            <p className="text-sm text-gray-500">About Doctor</p>
                                            <p className="font-medium">{selectedAppointment.docData?.about}</p>
                                        </div>
                                        <div className="md:col-span-3">
                                            <p className="text-sm text-gray-500">Address</p>
                                            <p className="font-medium">
                                                {JSON.parse(selectedAppointment.docData?.address || '{}').line1}<br />
                                                {JSON.parse(selectedAppointment.docData?.address || '{}').line2}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Confirmation Modal */}
            {isCancelModalOpen && appointmentToCancel && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div data-aos="zoom-in" className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex justify-between items-start border-b pb-4">
                                <h3 className="text-xl font-semibold text-gray-900">
                                    Confirm Cancellation
                                </h3>
                                <button
                                    onClick={closeCancelModal}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="mt-6">
                                <p className="text-gray-700 mb-4">
                                    Are you sure you want to cancel this appointment?
                                </p>
                                <div className="bg-blue-200 p-4 rounded-lg mb-4">
                                    <h4 className="font-medium text-gray-800 mb-2">Appointment Details:</h4>
                                    <p className="text-sm">
                                        <span className="font-medium">Patient:</span> {appointmentToCancel.userData?.firstname} {appointmentToCancel.userData?.lastname}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-medium">Date:</span> {formatDate(appointmentToCancel.slotDate)} at {appointmentToCancel.slotTime}
                                    </p>
                                    <p className="text-sm">
                                        <span className="font-medium">Doctor:</span> {appointmentToCancel.docData?.name} ({appointmentToCancel.docData?.speciality})
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-between space-x-3">
                                <button
                                    onClick={closeCancelModal}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-green-600 hover:text-white transition duration-200"
                                >
                                    No, Keep It
                                </button>
                                <button
                                    onClick={handleConfirmCancel}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-white hover:text-red-500 hover:border-red-500 border transition duration-200"
                                >
                                    Yes, Cancel Appointment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllAppointments;