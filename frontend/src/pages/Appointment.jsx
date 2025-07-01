import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { MdOutlineVerifiedUser } from "react-icons/md";
import { IoIosInformationCircleOutline, IoMdCheckmarkCircleOutline } from "react-icons/io";
import { CiLocationArrow1 } from "react-icons/ci";
import RelatedDoctors from "../components/RelatedDoctors";
import axios from "axios";
import { toast } from "react-toastify";
import { FaArrowRight } from "react-icons/fa6";

const Appointment = () => {
    const { docId } = useParams();
    const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const [docInfo, setDocInfo] = useState(null);
    const [docSlot, setDocSlot] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedSlot, setSelectedSlot] = useState(null);
    const navigate = useNavigate();

    const FetchDoc = async () => {
        const docInfo = doctors.find((item) => item._id === docId);
        if (docInfo) {
            // Parse the address string to object
            const parsedDocInfo = {
                ...docInfo,
                address: typeof docInfo.address === 'string' ?
                    JSON.parse(docInfo.address) :
                    docInfo.address
            };
            setDocInfo(parsedDocInfo);
        }
    }

    const getAvailableSlots = async () => {
        setDocSlot([]);
        let today = new Date();
        let slots = [];

        for (let i = 0; i < 7; i++) {
            let currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);

            // Format date string to match the key in slots_booked (e.g., "22_6_2025")
            let day = currentDate.getDate();
            let month = currentDate.getMonth() + 1;
            let year = currentDate.getFullYear();
            const dateKey = `${day}_${month}_${year}`;

            // Get booked slots for this date if they exist
            const bookedSlots = docInfo.slots_booked?.[dateKey] || [];

            let endTime = new Date(currentDate);
            endTime.setHours(19, 30, 0, 0);

            let startTime = new Date(currentDate);
            if (i === 0) { // Today
                startTime.setHours(startTime.getHours() > 10 ? startTime.getHours() + 1 : 10);
                startTime.setMinutes(startTime.getMinutes() > 30 ? 30 : 0);
            } else { // Future days
                startTime.setHours(10);
                startTime.setMinutes(0);
            }

            let timeSlots = [];
            while (startTime < endTime) {
                let formattedTime = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                // Check if this time slot is already booked
                const isBooked = bookedSlots.includes(formattedTime);

                timeSlots.push({
                    datetime: new Date(startTime),
                    time: formattedTime,
                    isAvailable: !isBooked // Set to false if already booked
                });
                startTime.setMinutes(startTime.getMinutes() + 30);
            }

            slots.push({
                date: new Date(currentDate),
                slots: timeSlots
            });
        }

        setDocSlot(slots);
    }

    const bookAppointment = async () => {
        if (!token) {
            toast.warn('Please Login To Book An Appointment');
            navigate('/login');
            return;
        }

        if (!selectedSlot) {
            toast.warn('Please select a time slot');
            return;
        }

        try {
            const date = selectedSlot.datetime;
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();
            const slotDate = day + "_" + month + "_" + year;

            // Get user data first
            const userResponse = await axios.get(`${backendUrl}/api/user/getprofile`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!userResponse.data.userData) {
                throw new Error('Could not fetch user data');
            }

            const { data } = await axios.post(
                `${backendUrl}/api/user/book-appointment`,
                {
                    docId,
                    slotDate,
                    slotTime: selectedSlot.time,
                    userId: userResponse.data.userData._id, // Add userId
                    userData: userResponse.data.userData // Add userData
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (data.success) {
                toast.success(data.message);
                getDoctorsData();
                navigate('/myappointments');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error.message);
        }
    }

    useEffect(() => {
        FetchDoc();
    }, [doctors, docId]);

    useEffect(() => {
        if (docInfo) {
            getAvailableSlots();
        }
    }, [docInfo]);

    return docInfo && (
        <>
            <div className="my-5 ">
                {/* Doctor Info Card */}
                <div data-aos="fade-right" className='flex flex-col sm:flex-row gap-4'>
                    <div className="sm:w-1/3 lg:w-1/4">
                        <img className='bg-blue-100 border !border-blue-300 w-full rounded-lg' src={docInfo.image} alt="Doctor_Image" />
                    </div>
                    <div className="flex-1 border !border-blue-300 rounded-lg p-4 sm:p-8 py-4 sm:py-7 bg-white sm:mx-0 mt-0 sm:mt-0">
                        <p className="flex items-center gap-2 text-xl sm:text-2xl font-medium text-gray-800 hover:text-primary transition-all duration-300">
                            {docInfo.name} <MdOutlineVerifiedUser className="text-green-500 w-5" />
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 my-1">
                            <p>{docInfo.degree}</p>
                            <p>|</p>
                            <button className="hover:text-primary transition-all duration-300">{docInfo.experience} Years</button>
                        </div>
                        <div>
                            <p className="flex items-center text-md gap-1 font-medium text-gray-800 mt-3">About <IoIosInformationCircleOutline className="mt-0.5" /></p>
                            <p className="text-gray-700 text-sm sm:text-base">{docInfo.about}</p>
                        </div>
                        <div>
                            <p className="flex items-center text-md gap-1 font-medium text-gray-800 mt-3">Address <CiLocationArrow1 /></p>
                            <p className="text-gray-700 text-sm sm:text-base">{docInfo.address.line1}</p>
                            <p className="text-gray-700 text-sm sm:text-base">{docInfo.address.line2}</p>
                        </div>
                        <p className="flex items-center text-md gap-1 font-medium text-gray-800 mt-3">
                            Appointment Fees : {currencySymbol} {docInfo.fees}
                        </p>
                    </div>
                </div>

                {/* Booking Slots */}
                <div data-aos="fade-left" className="sm:ml-[calc(33.33%+16px)] lg:ml-[calc(25%+16px)] sm:pl-4 mt-4 font-medium text-gray-800 text-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                        <p className="flex items-center gap-1 text-md font-medium text-gray-800">
                            Available Slots for {daysOfWeek[selectedDate.getDay()]} <IoMdCheckmarkCircleOutline className="mt-0.5 text-green-500" />
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2 my-1 sm:my-2">
                                <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                                <p className="text-sm sm:text-base">Available</p>
                            </div>
                            <div className="flex items-center gap-2 my-1 sm:my-2">
                                <p className="w-2 h-2 bg-blue-500 rounded-full"></p>
                                <p className="text-sm sm:text-base">Booked</p>
                            </div>
                            <div className="flex items-center gap-2 my-1 sm:my-2">
                                <p className="w-2 h-2 bg-red-500 rounded-full"></p>
                                <p className="text-sm sm:text-base">Unavailable</p>
                            </div>
                        </div>
                    </div>

                    {/* Date Selection */}
                    <div className="mt-4 flex gap-2 items-center w-full overflow-x-auto pb-2">
                        {docSlot.map((daySlot, index) => (
                            <div
                                onClick={() => {
                                    setSlotIndex(index);
                                    setSelectedDate(daySlot.date);
                                }}
                                key={index}
                                className={`flex group items-center gap-2 text-center p-2 px-3 sm:px-4 rounded-full cursor-pointer text-sm sm:text-base ${slotIndex === index ? 'bg-primary text-white' : 'border !border-blue-300 hover:bg-blue-100 hover:text-black transition-all duration-300'}`}
                            >
                                <p className="w-2 h-2 bg-green-500 rounded-full mx-auto"></p>
                                <p>{daysOfWeek[daySlot.date.getDay()].substring(0, 3)}</p>
                                <p>{daySlot.date.getDate()}</p>
                            </div>
                        ))}
                    </div>

                    {/* Time Slots */}
                    <p className="text-sm sm:text-base mt-2 flex items-center gap-2">Scroll To See More Slots <FaArrowRight /></p>
                    <div className="mt-2 flex gap-2 items-center w-full overflow-x-auto pb-2">
                        {docSlot.length > 0 && docSlot[slotIndex].slots.length > 0 ? (
                            docSlot[slotIndex].slots.map((slot, index) => (
                                <p
                                    key={index}
                                    onClick={() => {
                                        if (slot.isAvailable) {
                                            setSelectedSlot(slot);
                                        }
                                    }}
                                    className={`text-xs sm:text-sm font-light flex-shrink-0 px-3 sm:px-5 py-1 sm:py-2 rounded-full cursor-pointer ${selectedSlot?.time === slot.time && selectedSlot?.datetime.getTime() === slot.datetime.getTime()
                                            ? 'bg-green-500 text-white'
                                            : slot.isAvailable
                                                ? 'bg-blue-100 border !border-blue-300 text-gray-800'
                                                : 'bg-blue-500 text-white'
                                        } ${!slot.isAvailable ? 'cursor-not-allowed opacity-70' : ''
                                        }`}
                                >
                                    {slot.time}
                                </p>
                            ))
                        ) : (
                            <p className="text-xs sm:text-sm font-light px-3 sm:px-5 py-1 sm:py-2 rounded-full bg-gray-200 text-gray-600">
                                Booking Closed For Today
                            </p>
                        )}
                    </div>

                    <button onClick={bookAppointment} className="bg-primary text-white py-2 px-6 sm:px-8 mt-4 rounded-full hover:scale-105 transition-all duration-300 text-sm sm:text-base">
                        Book An Appointment
                    </button>
                </div>

                <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
            </div>
        </>
    )
}

export default Appointment;