import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const MyAppointments = () => {
    const { backendUrl, token, getDoctorsData } = useContext(AppContext);
    const navigate = useNavigate();
    const [appointment, setAppointment] = useState([]);
    const [cancelAppointmentModal, setCancelAppointmentModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [appointmentToCancel, setAppointmentToCancel] = useState(null);
    const months = [" ", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }

    const getUserAppointments = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/my-appointment`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (data.success) {
                setAppointment(data.appointments.reverse());
                // console.log(data.appointments);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/user/cancel-appointment`,
                { appointmentId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (data.success) {
                toast.success(data.message);
                getUserAppointments();
                getDoctorsData();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    // const initPay = (order) => {
    //     const options = {
    //         key: import.meta.env.VITE_RAZORPAY_KEY,
    //         amount: order.amount,
    //         currency: order.currency,
    //         name: "Prescripto - Appointment Payment",
    //         description: "Prescripto Appointment Payment",
    //         order_id: order.id,
    //         receipt: order.receipt,
    //         handler: async (response) => {
    //             // console.log(response);
    //             try {
    //                 const { data } = await axios.post(`${backendUrl}/api/user/verify-appointment-payment`, { response }, { headers: { Authorization: `Bearer ${token}` } });
    //                 if (data.success) {
    //                     toast.success(data.message);
    //                     getUserAppointments();
    //                     // getDoctorsData();
    //                     navigate('/my-appointments');
    //                 }
    //             } catch (error) {
    //                 console.log(error);
    //                 toast.error(error.message);
    //             }
    //         }
    //     }
    //     const rzp = new window.Razorpay(options);
    //     rzp.open();
    // }

    // const razorPayAppointment = async (appointmentId) => {
    //     try {
    //         const { data } = await axios.post(`${backendUrl}/api/user/razorpay-appointment`, { appointmentId }, { headers: { Authorization: `Bearer ${token}` } });

    //         if (data.success) {
    //             // console.log(data.order);
    //             initPay(data.order);
    //         }

    //     } catch (error) {

    //     }
    // }

    useEffect(() => {
        if (token) {
            getUserAppointments();
        }
    }, [token]);

    return (
        <>
            <Helmet>
                <title>Prescripto - My Appointments</title>
                <meta name="description" content="My Appointment Page" />
                <link rel="canonical" href="/myappointments" />
            </Helmet>
            <div className="mt-2 mb-5 sm:p-4">
                <p data-aos="fade-right" className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">
                    My Appointments Booking
                </p>
                <div data-aos="zoom-in" className="space-y-4 sm:space-y-6">
                    {appointment.length === 0 ? (
                        <p className="text-gray-500 text-center text-sm sm:text-lg py-32">
                            You have no appointments booked.
                        </p>
                    ) : (
                        appointment.slice(0, 3).map((item, index) => {
                            // Parse the address string to object
                            const docAddress = typeof item.docData.address === 'string'
                                ? JSON.parse(item.docData.address)
                                : item.docData.address;

                            return (
                                <div key={index} className="bg-white rounded-lg shadow-md border !border-blue-300 sm:p-6 flex flex-col md:flex-row gap-4 sm:gap-6">
                                    <div className="md:w-48 md:flex-shrink-0">
                                        <img src={item.docData.image} alt={item.docData.name} className="w-full" />
                                    </div>
                                    <div className="flex-grow px-3">
                                        <p className="text-lg sm:text-xl font-semibold">{item.docData.name}</p>
                                        <p className="text-gray-600 text-sm sm:text-base mb-1 sm:mb-2">{item.docData.speciality}</p>

                                        <div className="mb-1 sm:mb-2">
                                            <p className="font-medium text-gray-700 text-sm sm:text-base">Address:</p>
                                            <p className="text-gray-600 text-sm sm:text-base">
                                                {docAddress.line1}, {docAddress.line2}
                                            </p>
                                        </div>

                                        <p className="text-gray-600 text-sm sm:text-base mb-1 sm:mb-2">
                                            <span className="font-medium">Phone Number:</span> {item.userData.phone}
                                        </p>

                                        <p className="text-gray-600 text-sm sm:text-base">
                                            <span className="font-medium">Date & Time:</span> {slotDateFormat(item.slotDate)} | {item.slotTime}
                                        </p>
                                    </div>

                                    <div className="flex m-2 flex-col gap-2 sm:gap-3 md:justify-center">
                                        {item.cancelled && item.payment && <button className="sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50">Paid</button>}
                                        {!item.cancelled && item.payment && !item.isCompleted && (
                                            <button
                                                onClick={() => {
                                                    setAppointmentToCancel(item._id);
                                                    setCancelAppointmentModal(true);
                                                    scrollTo(0, 0);
                                                }}
                                                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition text-sm sm:text-base"
                                            >
                                                Cancel Appointment
                                            </button>)}
                                        {!item.cancelled && !item.isCompleted && (
                                            <button
                                                onClick={() => {
                                                    setShowPaymentModal(true);
                                                    // razorPayAppointment(item._id);
                                                    scrollTo(0, 0);
                                                }}
                                                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-100 text-green-600 rounded-md hover:bg-green-200 transition text-sm sm:text-base"
                                            >
                                                Pay Now
                                            </button>
                                        )}
                                        {item.cancelled && (
                                            <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500 hover:bg-red-300 hover:text-black transition-all duration-300">Appointment Cancelled</button>
                                        )}
                                        {!item.cancelled && item.isCompleted && (
                                            <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500 hover:bg-green-300 hover:text-black transition-all duration-300">Appointment Completed</button>
                                        )}
                                    </div>
                                </div>
                            );
                        }))}
                </div>
                {cancelAppointmentModal && (
                    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div data-aos="zoom-in" className="bg-white rounded-lg p-6">
                            <p className="text-lg font-semibold mb-4">Cancel Appointment</p>
                            <p className="text-gray-600 mb-4">Are you sure you want to cancel this appointment?</p>
                            <div className="flex justify-between">
                                <button onClick={() => setCancelAppointmentModal(false)} className="px-4 py-2 bg-gray-400 hover:bg-gray-300 rounded-md mr-2">No</button>
                                <button onClick={() => { cancelAppointment(appointmentToCancel), setCancelAppointmentModal(false) }} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md">Yes</button>
                            </div>
                        </div>
                    </div>
                )}
                {showPaymentModal && (
                    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div data-aos="zoom-in" className="bg-white rounded-lg p-6 max-w-md">
                            <p className="text-lg font-semibold mb-4">Payment Information</p>
                            <p className="text-gray-600 mb-4">
                                Online payment option is coming soon! 🚀<br /><br />
                                For now, please pay in cash when you visit the doctor.
                            </p>
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md"
                                >
                                    Got it!
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default MyAppointments;