import { useContext, useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets_frontend/assets';
import { AppContext } from '../context/AppContext';

const Profile = () => {
    const { userData, setUserData, token, backendUrl, loadUserData } = useContext(AppContext);
    // console.log(userData);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editedData, setEditedData] = useState({
        ...userData,
        dob: userData.dob || '' // Ensure dob is either a valid date string or empty
    });
    const [image, setImage] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const updateUserProfile = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            const formData = new FormData();
            formData.append('firstname', editedData.firstname);
            formData.append('lastname', editedData.lastname);
            formData.append('phone', editedData.phone);
            formData.append('address', JSON.stringify(editedData.address));
            formData.append('email', editedData.email);
            formData.append('dob', editedData.dob);
            formData.append('gender', editedData.gender);
            if (image) {
                formData.append('image', image);
            }

            const { data } = await axios.post(`${backendUrl}/api/user/updateprofile`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (data.success) {
                toast.success(data.message);
                setIsEditModalOpen(false);
                loadUserData();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error.message || 'Update failed');
        } finally {
            setIsUpdating(false);
        }
    }

    useEffect(() => {
        AOS.init({ duration: 800 });
    }, []);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isEditModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isEditModalOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setEditedData(prev => ({
            ...prev,
            address: {
                ...prev.address,
                [name]: value
            }
        }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const formatDateForInput = (dateString) => {
        if (!dateString) return '';

        try {
            const date = new Date(dateString);
            // Check if the date is valid
            if (isNaN(date.getTime())) return '';

            // Convert to YYYY-MM-DD format
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');

            return `${year}-${month}-${day}`;
        } catch (error) {
            console.error('Error formatting date:', error);
            return '';
        }
    };

    return (
        <>
            <Helmet>
                <title>Prescripto - Profile</title>
                <meta name="description" content="Profile Page" />
                <link rel="canonical" href="/myprofile" />
            </Helmet>
            <div className="min-h-screen py-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-8 sm:mb-12" data-aos="fade-down">
                        My <span className="text-primary">Profile</span>
                    </h1>

                    <div className="bg-white rounded-xl sm:rounded-2xl border !border-blue-300 overflow-hidden" data-aos="fade-up">
                        {/* Profile Header */}
                        <div className="p-4 bg-blue-300 text-gray-800">
                            <div className="flex flex-col sm:flex-row items-center">
                                <img
                                    src={userData.image || assets.user_icon}
                                    alt="Profile"
                                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-gray-600 shadow-lg mb-4 sm:mb-0 sm:mr-6"
                                />
                                <div className="text-center sm:text-left">
                                    <h2 className="text-2xl sm:text-3xl font-bold">{userData.firstname} {userData.lastname}</h2>
                                    <p className="text-blue-900 text-sm sm:text-base">{userData.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Profile Content */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 p-4 sm:p-6 md:p-8">
                            {/* Basic Information */}
                            <div>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 pb-2 border-b border-gray-200 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Basic Information
                                </h3>
                                <div className="space-y-3 sm:space-y-4">
                                    <div>
                                        <p className="text-xs sm:text-sm text-gray-500">First Name</p>
                                        <p className="font-medium text-sm sm:text-base">{userData.firstname}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs sm:text-sm text-gray-500">Last Name</p>
                                        <p className="font-medium text-sm sm:text-base">{userData.lastname}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs sm:text-sm text-gray-500">Gender</p>
                                        <p className="font-medium text-sm sm:text-base">{userData.gender}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs sm:text-sm text-gray-500">Birthday</p>
                                        <p className="font-medium text-sm sm:text-base">{userData.dob ? new Date(userData.dob).toLocaleDateString() : ''}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div>
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 pb-2 border-b border-gray-200 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    Contact Information
                                </h3>
                                <div className="space-y-3 sm:space-y-4">
                                    <div>
                                        <p className="text-xs sm:text-sm text-gray-500">Email</p>
                                        <p className="font-medium text-sm sm:text-base">{userData.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs sm:text-sm text-gray-500">Phone</p>
                                        <p className="font-medium text-sm sm:text-base">{userData.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs sm:text-sm text-gray-500">Address</p>
                                        <p className="font-medium text-sm sm:text-base">{userData.address?.line1}</p>
                                        <p className="font-medium text-sm sm:text-base">{userData.address?.line2}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="bg-gray-50 px-4 sm:px-6 md:px-8 py-3 sm:py-4 flex justify-end">
                            <button
                                onClick={() => {
                                    setEditedData({ ...userData });
                                    setIsEditModalOpen(true);
                                }}
                                className="px-4 sm:px-6 py-1.5 sm:py-2 bg-primary text-white rounded-lg hover:!bg-primary/50 transition duration-300 shadow-md text-sm sm:text-base"
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Edit Modal */}
                {isEditModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                        <div data-aos="fade-up" className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">

                            <div className="p-4 sm:p-6">
                                <div className="flex justify-between items-center mb-4 sm:mb-6">
                                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Edit Profile</h3>
                                    <button
                                        onClick={() => !isUpdating && setIsEditModalOpen(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                        disabled={isUpdating}
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <form onSubmit={updateUserProfile}>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                                        {/* Left Column (3 fields) */}
                                        <div className="space-y-3 sm:space-y-4">
                                            <div>
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">First Name</label>
                                                <input
                                                    type="text"
                                                    name="firstname"
                                                    value={editedData.firstname || ''}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Gender</label>
                                                <select
                                                    name="gender"
                                                    value={editedData.gender || ''}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                                >
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Phone</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={editedData.phone || ''}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Middle Column (3 fields) */}
                                        <div className="space-y-3 sm:space-y-4">
                                            <div>
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                                <input
                                                    type="text"
                                                    name="lastname"
                                                    value={editedData.lastname || ''}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Birthday</label>
                                                <input
                                                    type="date"
                                                    name="dob"
                                                    value={formatDateForInput(editedData.dob)}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={editedData.email || ''}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Right Column (Address and Image) */}
                                        <div className="space-y-3 sm:space-y-4">
                                            <div>
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                                                <textarea
                                                    name="line1"
                                                    value={editedData.address?.line1 || ''}
                                                    onChange={handleAddressChange}
                                                    rows="2"
                                                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                                                <textarea
                                                    name="line2"
                                                    value={editedData.address?.line2 || ''}
                                                    onChange={handleAddressChange}
                                                    rows="2"
                                                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 sm:mt-8 flex justify-end space-x-3 sm:space-x-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsEditModalOpen(false)}
                                            className="px-4 sm:px-5 py-1.5 sm:py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-300 text-sm sm:text-base"
                                            disabled={isUpdating}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className={`px-4 sm:px-5 py-1.5 sm:py-2.5 bg-primary text-white rounded-md hover:bg-primary/90 transition duration-300 text-sm sm:text-base ${isUpdating ? 'opacity-50' : ''}`}
                                            disabled={isUpdating}
                                        >
                                            {isUpdating ? (
                                                <span className="flex items-center">
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Saving...
                                                </span>
                                            ) : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Profile;