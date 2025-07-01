import React, { useState, useContext, useEffect } from 'react';
import { DoctorContext } from '../context/DoctorContext';
import { FaUserMd, FaEdit, FaSave, FaCalendarAlt, FaGraduationCap, FaHospital, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { RiMentalHealthLine } from 'react-icons/ri';
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorProfile = () => {
    const { doctorProfile, getDoctorProfile, appointments, getAppointments, backendURL, doctorToken, loadingProfile } = useContext(DoctorContext);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        speciality: "",
        experience: "",
        hospital: "",
        phone: "",
        email: "",
        address: "",
        about: "",
        fees: 0,
        available: true
    });

    const specializationsMap = {
        "General Physician": [
            "Comprehensive Diagnosis",
            "Preventive Care",
            "Chronic Disease Management",
            "Infections & Common Ailments",
            "Patient Education"
        ],
        "Gynecologist": [
            "Pregnancy & Childbirth (Obstetrics)",
            "Sexual Health & STD Management",
            "Gynecological Surgeries",
            "Teen & Adolescent Gynecology",
            "Menopausal & Postmenopausal Care"
        ],
        "Dermatologist": [
            "Skin Disease Diagnosis & Treatment",
            "Hair & Scalp Disorders",
            "Nail Conditions",
            "Skin Cancer Detection & Treatment",
            "Autoimmune & Systemic Skin Diseases"
        ],
        "Pediatricians": [
            "Newborn & Infant Care",
            "Growth & Development Monitoring",
            "Treatment of Common Childhood Illnesses",
            "Chronic Disease Management",
            "Behavioral & Mental Health"
        ],
        "Neurologist": [
            "Brain Disorders",
            "Neurodegenerative Diseases",
            "Spinal Cord & Nerve Disorders",
            "Muscle Disorders",
            "Headache & Migraine Clinics"
        ],
        "Gastroenterologist": [
            "Digestive System Disorders",
            "Gallbladder & Pancreas Conditions",
            "Gastrointestinal Cancers",
            "Liver Disorders (Hepatology)",
            "Endoscopy & Colonoscopy"
        ]
    };

    const colorClasses = [
        "bg-blue-100 text-blue-800",
        "bg-green-100 text-green-800",
        "bg-purple-100 text-purple-800",
        "bg-yellow-100 text-yellow-800",
        "bg-red-100 text-red-800"
    ];

    // Calculate statistics
    const calculateStats = () => {
        if (!appointments || appointments.length === 0) return {
            appointmentCount: 0,
            patientCount: 0,
            earnings: 0
        };

        const uniquePatients = new Set();
        let earnings = 0;

        appointments.forEach(app => {
            uniquePatients.add(app.userData._id);
            if (app.isCompleted && !app.cancelled) {
                earnings += app.amount || 0;
            }
        });

        return {
            appointmentCount: appointments.length,
            patientCount: uniquePatients.size,
            earnings
        };
    };

    const stats = calculateStats();

    useEffect(() => {
        if (doctorProfile) {
            try {
                const addressObj = typeof doctorProfile.address === 'string' ?
                    JSON.parse(doctorProfile.address) :
                    doctorProfile.address;

                setFormData({
                    name: doctorProfile.name || "",
                    speciality: doctorProfile.speciality || "",
                    experience: doctorProfile.experience || "",
                    hospital: doctorProfile.hospital || "City General Hospital",
                    phone: doctorProfile.phone || "+91 9876543210",
                    email: doctorProfile.email || "",
                    address: addressObj ? `${addressObj.line1}, ${addressObj.line2}` : "",
                    about: doctorProfile.about || "",
                    fees: doctorProfile.fees || 0,
                    available: doctorProfile.available !== false // Default to true if undefined
                });
            } catch (e) {
                console.error("Error parsing address:", e);
                setFormData(prev => ({
                    ...prev,
                    address: "Address not available"
                }));
            }
        } else {
            getDoctorProfile();
        }
    }, [doctorProfile]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Special handling for boolean fields
        if (name === 'available') {
            setFormData(prev => ({
                ...prev,
                [name]: value === 'true' || value === true
            }));
        }
        // Special handling for number fields
        else if (name === 'fees') {
            setFormData(prev => ({
                ...prev,
                [name]: Number(value)
            }));
        }
        else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSave = async () => {
        try {
            // Format the address properly before sending
            let formattedAddress = formData.address;

            // If address is a string, try to parse it or create a proper object
            if (typeof formattedAddress === 'string') {
                try {
                    // Try to parse if it's already JSON
                    formattedAddress = JSON.parse(formattedAddress);
                } catch (e) {
                    // If not JSON, create a simple address object
                    formattedAddress = {
                        line1: formattedAddress.split(',')[0]?.trim() || '',
                        line2: formattedAddress.split(',')[1]?.trim() || ''
                    };
                }
            }

            // Create the data to send
            const dataToSend = {
                ...formData,
                address: formattedAddress
            };

            // Make API call to update profile
            const response = await axios.put(`${backendURL}/api/doctor/profile`, dataToSend, {
                headers: {
                    Authorization: `Bearer ${doctorToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                toast.success("Profile updated successfully");
                await getDoctorProfile(); // Refresh profile data
                setIsEditing(false);
            }
        } catch (error) {
            toast.error("Failed to update profile");
            console.error("Update error:", error.response?.data || error.message);
        }
    };

    if (loadingProfile) {
        return <div className="flex justify-center items-center h-64">Loading profile...</div>;
    }

    if (!doctorProfile && !loadingProfile) {
        return <div className="flex justify-center items-center h-64">Failed to load profile. Please try again.</div>;
    }

    return (
        <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Doctor Profile</h1>
                <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className={`flex items-center px-4 py-2 rounded-lg ${isEditing ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white w-full sm:w-auto justify-center`}
                >
                    {isEditing ? (
                        <>
                            <FaSave className="mr-2" /> Save Changes
                        </>
                    ) : (
                        <>
                            <FaEdit className="mr-2" /> Edit Profile
                        </>
                    )}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Left Column - Profile Card */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:scale-105 transition-all duration-300 md:col-span-2 lg:col-span-1">
                    <div className="bg-blue-500 h-32 relative">
                        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                            <div className="h-32 w-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                                <img
                                    src={doctorProfile.image || "https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg"}
                                    alt="Doctor"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="pt-20 pb-6 px-6 text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-1">
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full text-center border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                                />
                            ) : (
                                formData.name
                            )}
                        </h2>
                        <p className="text-blue-500 mb-4">
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="speciality"
                                    value={formData.speciality}
                                    onChange={handleInputChange}
                                    className="w-full text-center border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                                />
                            ) : (
                                formData.speciality
                            )}
                        </p>

                        <div className="flex justify-center space-x-4 mb-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-800">{stats.patientCount}+</div>
                                <div className="text-sm text-gray-500">Patients</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-800">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="experience"
                                            value={formData.experience}
                                            onChange={handleInputChange}
                                            className="w-12 text-center border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                                        />
                                    ) : (
                                        formData.experience
                                    )}
                                </div>
                                <div className="text-sm text-gray-500">Years Exp.</div>
                            </div>
                        </div>

                        <div className="space-y-4 text-left">
                            <div className="flex items-center">
                                <FaEnvelope className="text-gray-500 mr-3" />
                                <span>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                                        />
                                    ) : (
                                        formData.email
                                    )}
                                </span>
                            </div>
                            <div className="flex items-start">
                                <FaMapMarkerAlt className="text-gray-500 mr-3 mt-1" />
                                <span>
                                    {isEditing ? (
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                                            rows="2"
                                        />
                                    ) : (
                                        formData.address
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Middle Column - About and Schedule */}
                <div className="space-y-6 md:col-span-2 lg:col-span-1">
                    {/* About Section */}
                    <div className="bg-white rounded-xl shadow-md p-6 hover:scale-105 transition-all duration-300">
                        <h3 className="text-xl font-semibold mb-4 flex items-center">
                            <RiMentalHealthLine className="mr-2 text-blue-500" /> About Me
                        </h3>
                        {isEditing ? (
                            <textarea
                                name="about"
                                value={formData.about}
                                onChange={handleInputChange}
                                className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                            />
                        ) : (
                            <p className="text-gray-600">{formData.about}</p>
                        )}
                    </div>

                    {/* Education Section */}
                    <div className="bg-white rounded-xl shadow-md p-6 hover:scale-105 transition-all duration-300">
                        <h3 className="text-xl font-semibold mb-4 flex items-center">
                            <FaGraduationCap className="mr-2 text-blue-500" /> Education
                        </h3>
                        <div className="space-y-4">
                            <div className="border-l-4 border-blue-500 pl-4 py-1">
                                <h4 className="font-medium">{doctorProfile.degree}</h4>
                                <p className="text-sm text-gray-500">{doctorProfile.speciality}</p>
                            </div>
                        </div>
                    </div>
                    {/* Specializations */}
                    <div className="bg-white rounded-xl shadow-md p-6 hover:scale-105 transition-all duration-300">
                        <h3 className="text-xl font-semibold mb-4">Specializations</h3>
                        <div className="flex flex-wrap gap-2">
                            {specializationsMap[doctorProfile.speciality]?.map((spec, index) => (
                                <span
                                    key={index}
                                    className={`px-3 py-1 rounded-full text-sm ${colorClasses[index % colorClasses.length]}`}
                                >
                                    {spec}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Schedule and Stats */}
                <div className="space-y-6 md:col-span-2 lg:col-span-1">
                    {/* Availability */}
                    <div className="bg-white rounded-xl shadow-md p-6 hover:scale-105 transition-all duration-300">
                        <h3 className="text-xl font-semibold mb-4 flex items-center">
                            <FaCalendarAlt className="mr-2 text-blue-500" /> Availability
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="font-medium">Monday - Sunday</span>
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">10:00 AM - 7:00 PM</span>
                            </div>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="bg-white rounded-xl shadow-md p-6 hover:scale-105 transition-all duration-300">
                        <h3 className="text-xl font-semibold mb-4">Monthly Statistics</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">Appointments</span>
                                    <span className="text-sm font-bold">{stats.appointmentCount}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${Math.min(100, (stats.appointmentCount / 30) * 100)}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">Patients</span>
                                    <span className="text-sm font-bold">{stats.patientCount}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${Math.min(100, (stats.patientCount / 30) * 100)}%` }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">Earnings</span>
                                    <span className="text-sm font-bold">₹{stats.earnings}</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${Math.min(100, (stats.earnings / (doctorProfile.fees * 30)) * 100)}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Add to your statistics section or another appropriate location */}
                    <div className="bg-white rounded-xl shadow-md p-6 hover:scale-105 transition-all duration-300">
                        <h3 className="text-xl font-semibold mb-4">Professional Details</h3>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Consultation Fees:</span>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        name="fees"
                                        value={formData.fees}
                                        onChange={handleInputChange}
                                        className="w-24 p-2 border border-gray-300 rounded-lg"
                                    />
                                ) : (
                                    <span>₹{formData.fees}</span>
                                )}
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="font-medium">Currently Available:</span>
                                {isEditing ? (
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="available"
                                            checked={formData.available}
                                            onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                                        <span className="ml-3 text-sm font-medium text-gray-900">
                                            {formData.available ? "Available" : "Unavailable"}
                                        </span>
                                    </label>
                                ) : (
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${formData.available
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                        }`}>
                                        {formData.available ? "Available" : "Unavailable"}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorProfile;