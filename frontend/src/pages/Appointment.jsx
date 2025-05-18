import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { MdOutlineVerifiedUser } from "react-icons/md";
import { IoIosInformationCircleOutline, IoMdCheckmarkCircleOutline } from "react-icons/io";
import { CiLocationArrow1 } from "react-icons/ci";
import RelatedDoctors from "../components/RelatedDoctors";

const Appointment = () => {
    // Youtube Time: 3:03:35
    // Figma: https://www.figma.com/design/ZLkjwG5ehxNRrC4SUA2WG7/Prescripto---UI-Design?node-id=0-1&p=f&t=nyiWlciroPSNonhA-0
    const { docId } = useParams();
    const { doctors, currencySymbol } = useContext(AppContext);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const [docInfo, setDocInfo] = useState(null);
    const [docSlot, setDocSlot] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedSlot, setSelectedSlot] = useState(null);

    const FetchDoc = async () => {
        const docInfo = doctors.find((item) => item._id === docId);
        setDocInfo(docInfo);
    }

    const getAvailableSlots = async () => {
        let slotsByDay = [];
        let today = new Date();

        for (let i = 0; i < 7; i++) {
            // Getting Date With Index
            let currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);

            // Setting End Time Of Date With Index
            let endTime = new Date(currentDate);
            endTime.setHours(20, 0, 0, 0);

            // Setting Start Time
            let startTime = new Date(currentDate);
            if (i === 0) {
                // For today, start from current hour + 1, or 10 AM if it's early
                const currentHour = startTime.getHours();
                startTime.setHours(currentHour >= 10 ? currentHour + 1 : 10);
                startTime.setMinutes(0);
            } else {
                startTime.setHours(10);
                startTime.setMinutes(0);
            }

            let timeSlots = [];

            while (startTime < endTime) {
                let formattedTime = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                timeSlots.push({
                    datetime: new Date(startTime),
                    time: formattedTime,
                    isAvailable: true // You can modify this based on actual availability
                });

                // Increment by 1 hour
                startTime.setHours(startTime.getHours() + 1);
            }

            slotsByDay.push({
                date: new Date(currentDate),
                slots: timeSlots
            });
        }

        setDocSlot(slotsByDay);
    }

    useEffect(() => {
        FetchDoc();
    }, [doctors, docId]);

    useEffect(() => {
        if (docInfo) {
            getAvailableSlots();
        }
    }, [docInfo]);

    // UseEffect For Testing Purposes
    // useEffect(() => {
    //     console.log(docSlot);
    // }, [docSlot]);

    return docInfo && (
        <>
            <div className="my-5">
                {/* Doctor Info Card */}
                <div data-aos="fade-right" className='flex flex-col sm:flex-row gap-4'>
                    <div>
                        <img className='bg-blue-100 border !border-blue-300 w-full sm:max-w-96 rounded-lg' src={docInfo.image} alt="Doctor_Image" />
                    </div>
                    <div className="flex-1 border !border-blue-300 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
                        <p className="flex items-center gap-2 text-2xl font-medium text-gray-800 hover:text-primary transition-all duration-300">{docInfo.name} <MdOutlineVerifiedUser className="text-green-500 w-5" /></p>
                        <div className="flex items-center gap-2 text-sm text-gray-600 my-1">
                            <p>{docInfo.degree}</p>
                            <p>|</p>
                            <button className="hover:text-primary transition-all duration-300">{docInfo.experience}</button>
                        </div>
                        <div>
                            <p className="flex items-center text-md gap-1 font-medium text-gray-800 mt-3">About <IoIosInformationCircleOutline className="mt-0.5" /></p>
                            <p className="text-gray-700">{docInfo.about}</p>
                        </div>
                        <div>
                            <p className="flex items-center text-md gap-1 font-medium text-gray-800 mt-3">Address <CiLocationArrow1 /></p>
                            <p className="text-gray-700">{docInfo.address.line1}</p>
                            <p className="text-gray-700">{docInfo.address.line2}</p>
                        </div>
                        <p className="flex items-center text-md gap-1 font-medium text-gray-800 mt-3">Appointment Fees : {currencySymbol} {docInfo.fees}</p>
                    </div>
                </div>
                {/* Booking Slots */}
                <div data-aos="fade-left" className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-800 text-lg">
                    <div className="flex items-center gap-5">
                        <p className="flex items-center gap-1 text-md font-medium text-gray-800">Available Slots for {daysOfWeek[selectedDate.getDay()]} <IoMdCheckmarkCircleOutline className="mt-0.5 text-green-500" /></p>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 my-2">
                                <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                                <p>Available</p>
                            </div>
                            <div className="flex items-center gap-2 my-2">
                                <p className="w-2 h-2 bg-blue-500 rounded-full"></p>
                                <p>Booked</p>
                            </div>
                            <div className="flex items-center gap-2 my-2">
                                <p className="w-2 h-2 bg-red-500 rounded-full"></p>
                                <p>Unavailable</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 flex gap-2 items-center w-full overflow-x-auto">
                        {docSlot.map((daySlot, index) => (
                            <div
                                onClick={() => {
                                    setSlotIndex(index);
                                    setSelectedDate(daySlot.date);
                                }}
                                key={index}
                                className={`flex group items-center gap-2 text-center p-2 px-4 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border !border-blue-300 hover:bg-blue-100 hover:text-black transition-all duration-300'}`}
                            >
                                <p className="w-2 h-2 bg-green-500 rounded-full mx-auto"></p>
                                <p>{daysOfWeek[daySlot.date.getDay()].substring(0, 3)}</p>
                                <p>{daySlot.date.getDate()}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex gap-2 items-center w-full overflow-x-auto">
                        {docSlot.length > 0 && docSlot[slotIndex].slots.map((slot, index) => (
                            <p
                                key={index}
                                onClick={() => {
                                    if (slot.isAvailable) {
                                        setSelectedSlot(slot);
                                    }
                                }}
                                className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${selectedSlot?.time === slot.time && selectedSlot?.datetime.getTime() === slot.datetime.getTime()
                                    ? 'bg-green-500 text-white' // Selected slot color
                                    : slot.isAvailable
                                        ? 'bg-blue-100 border !border-blue-300 text-gray-800' // Available slot color
                                        : 'bg-red-500 text-white' // Unavailable slot color
                                    } ${!slot.isAvailable ? 'cursor-not-allowed opacity-70' : ''
                                    }`}
                            >
                                {slot.time}
                            </p>
                        ))}
                    </div>
                    <button className="bg-primary text-white py-2 px-8 mt-4 rounded-full hover:scale-105 transition-all duration-300">Book An Appointment</button>
                </div>
                <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
            </div>
        </>
    )
}

export default Appointment