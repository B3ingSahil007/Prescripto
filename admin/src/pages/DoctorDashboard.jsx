import React, { useEffect, useState } from 'react';
import { FaCalendarCheck, FaCalendarTimes, FaCalendarAlt, FaUserMd, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { DoctorContext } from '../context/DoctorContext';
import { useContext } from 'react';

Chart.register(...registerables);

const DoctorDashboard = () => {
    const { appointments, dashData, getDashData, doctorToken, getAppointments } = useContext(DoctorContext);
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        cancelled: 0,
        upcoming: 0,
        earning: 0
    });
    console.log(dashData);

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

    useEffect(() => {
        if (doctorToken) {
            getAppointments();
            getDashData();
        }
    }, [doctorToken]);

    const calculateStats = () => {
        const today = new Date();

        // Filter upcoming appointments (next 7 days)
        const upcomingApps = appointments.filter(app => {
            try {
                const [day, month, year] = app.slotDate.split('_');
                const appDate = new Date(year, month - 1, day);
                return !app.cancelled && !app.isCompleted &&
                    appDate >= today &&
                    appDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
            } catch (e) {
                console.error("Error parsing date:", app.slotDate);
                return false;
            }
        });

        // Calculate unique patients
        const uniquePatients = new Set();
        appointments.forEach(app => {
            if (app.userData?._id) {
                uniquePatients.add(app.userData._id);
            }
        });

        // Use dashData.earning if available, otherwise calculate locally
        const completedCount = dashData?.totalCompletedAppointments ||
            appointments.filter(app => app.isCompleted && !app.cancelled).length;

        const cancelledCount = dashData?.totalCancelledAppointments ||
            appointments.filter(app => app.cancelled).length;

        const totalEarning = dashData?.earning ||
            appointments.reduce((total, app) => {
                return total + ((app.isCompleted && !app.cancelled && app.amount) ? app.amount : 0);
            }, 0);

        setStats({
            total: appointments.length,
            completed: completedCount,
            cancelled: cancelledCount,
            upcoming: upcomingApps.length,
            earning: totalEarning,
            patientCount: dashData?.patients || uniquePatients.size
        });
    };

    // Format date from "27_6_2025" to "27 June 2025"
    const formatDate = (dateStr) => {
        try {
            const [day, month, year] = dateStr.split("_");
            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
            return `${day} ${monthNames[parseInt(month) - 1]} ${year}`;
        } catch (e) {
            console.error("Error formatting date:", dateStr);
            return dateStr;
        }
    };

    // Data for bar chart (appointments by month)
    const getBarChartData = () => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const counts = new Array(12).fill(0);

        appointments.forEach(app => {
            try {
                // Parse date in format "day_month_year"
                const [day, month, year] = app.slotDate.split('_');
                const date = new Date(year, month - 1, day);
                const monthIndex = date.getMonth();
                counts[monthIndex]++;
            } catch (e) {
                console.error("Error parsing date for chart:", app.slotDate);
            }
        });

        return {
            labels: monthNames,
            datasets: [
                {
                    label: 'Appointments',
                    data: counts,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }
            ]
        };
    };

    // Data for pie chart (appointment status)
    const getPieChartData = () => {
        return {
            labels: ['Completed', 'Cancelled', 'Upcoming'],
            datasets: [
                {
                    data: [stats.completed, stats.cancelled, stats.upcoming],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(255, 206, 86, 0.6)'
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 206, 86, 1)'
                    ],
                    borderWidth: 1
                }
            ]
        };
    };

    // Get upcoming appointments (next 7 days)
    const getUpcomingAppointments = () => {
        const today = new Date();
        const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

        return appointments
            .filter(app => {
                try {
                    // Parse date in format "day_month_year"
                    const [day, month, year] = app.slotDate.split('_');
                    const appDate = new Date(year, month - 1, day);
                    return !app.cancelled && !app.isCompleted &&
                        appDate >= today && appDate <= nextWeek;
                } catch (e) {
                    console.error("Error parsing upcoming appointment date:", app.slotDate);
                    return false;
                }
            })
            .sort((a, b) => {
                try {
                    const [dayA, monthA, yearA] = a.slotDate.split('_');
                    const [dayB, monthB, yearB] = b.slotDate.split('_');
                    const dateA = new Date(yearA, monthA - 1, dayA);
                    const dateB = new Date(yearB, monthB - 1, dayB);
                    return dateA - dateB;
                } catch (e) {
                    return 0;
                }
            })
            .slice(0, 5);
    };

    // Get recent activity (sorted by date, newest first)
    const getRecentActivity = () => {
        return [...appointments]
            .sort((a, b) => {
                try {
                    const [dayA, monthA, yearA] = a.slotDate.split('_');
                    const [dayB, monthB, yearB] = b.slotDate.split('_');
                    const dateA = new Date(yearA, monthA - 1, dayA);
                    const dateB = new Date(yearB, monthB - 1, dayB);
                    return dateB - dateA;
                } catch (e) {
                    return 0;
                }
            })
            .slice(0, 3);
    };

    useEffect(() => {
        if (appointments && appointments.length > 0) {
            calculateStats();
        }
    }, [appointments, dashData]); // Add dashData as dependency

    return (
        <div className="container mx-auto px-4 py-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Doctor Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-lg p-4 flex items-center hover:scale-110 transition-all duration-300">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                        <FaCalendarCheck size={24} />
                    </div>
                    <div>
                        <h3 className="text-gray-500 text-sm">Total Appointments</h3>
                        <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-4 flex items-center hover:scale-110 transition-all duration-300">
                    <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                        <FaCalendarCheck size={24} />
                    </div>
                    <div>
                        <h3 className="text-gray-500 text-sm">Completed</h3>
                        <p className="text-2xl font-bold">{stats.completed}</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-4 flex items-center hover:scale-110 transition-all duration-300">
                    <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                        <FaCalendarTimes size={24} />
                    </div>
                    <div>
                        <h3 className="text-gray-500 text-sm">Cancelled</h3>
                        <p className="text-2xl font-bold">{stats.cancelled}</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-4 flex items-center hover:scale-110 transition-all duration-300">
                    <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                        <FaCalendarAlt size={24} />
                    </div>
                    <div>
                        <h3 className="text-gray-500 text-sm">Upcoming</h3>
                        <p className="text-2xl font-bold">{stats.upcoming}</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-4 flex items-center hover:scale-110 transition-all duration-300">
                    <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                        <FaMoneyBillWave size={24} />
                    </div>
                    <div>
                        <h3 className="text-gray-500 text-sm">Total Earnings</h3>
                        <p className="text-2xl font-bold">₹{stats.earning}</p>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <FaChartLine className="mr-2 text-blue-500" /> Appointments by Month
                    </h3>
                    <div className="h-64">
                        <Bar
                            data={getBarChartData()}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            precision: 0,
                                            stepSize: 1
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <FaChartLine className="mr-2 text-blue-500" /> Appointment Status
                    </h3>
                    <div className="h-64">
                        <Pie
                            data={getPieChartData()}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold flex items-center">
                        <FaCalendarAlt className="mr-2 text-blue-500" /> Upcoming Appointments (Next 7 Days)
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fees</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {getUpcomingAppointments().length > 0 ? (
                                getUpcomingAppointments().map(appointment => (
                                    <tr key={appointment._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img
                                                        className="h-10 w-10 rounded-full"
                                                        src={appointment.userData?.image || "https://via.placeholder.com/40"}
                                                        alt={appointment.userData?.firstname || "Patient"}
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {appointment.userData?.firstname || "Unknown"} {appointment.userData?.lastname || ""}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {calculateAge(appointment.userData?.dob)} years
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(appointment.slotDate)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {appointment.slotTime}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ₹{appointment.amount || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {appointment.userData?.phone || "N/A"}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                        No upcoming appointments in the next 7 days
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold">Recent Activity</h3>
                </div>
                <div className="divide-y divide-gray-200">
                    {appointments && getRecentActivity().length > 0 ? (
                        getRecentActivity().map(appointment => (
                            <div key={appointment._id} className="px-6 py-4">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                        <FaUserMd className="text-blue-500" />
                                    </div>
                                    <div className="ml-4 flex gap-10">
                                        <p className="text-sm font-medium text-gray-900">
                                            Appointment with {appointment.userData?.firstname || "Unknown"} {appointment.userData?.lastname || ""}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {formatDate(appointment.slotDate)} at {appointment.slotTime} -
                                            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${appointment.cancelled ? "bg-red-100 text-red-800" : appointment.isCompleted ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
                                                {appointment.cancelled ? "Cancelled" : appointment.isCompleted ? "Completed" : "Upcoming"}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="px-6 py-4 text-center text-sm text-gray-500">
                            No recent activity
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;