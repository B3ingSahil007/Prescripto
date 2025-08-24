import React, { useContext, useEffect, useState } from 'react';
import { FaUserMd, FaCalendarAlt, FaUsers, FaProcedures, FaChartLine, FaCalendarCheck, FaCalendarTimes } from 'react-icons/fa';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { AdminContext } from '../context/AdminContext';
ChartJS.register(...registerables);

const Dashboard = () => {
    const {
        adminToken,
        doctors,
        appointments,
        getAllDoctors,
        getAllAppointments,
        getDashData,
        dashData
    } = useContext(AdminContext);

    const [stats, setStats] = useState({
        totalDoctors: 0,
        totalAppointments: 0,
        upcomingAppointments: 0,
        canceledAppointments: 0,
        totalUsers: 0,
        revenue: 0,
    });

    const [recentAppointments, setRecentAppointments] = useState([]);

    useEffect(() => {
        if (adminToken) {
            getAllDoctors();
            getAllAppointments();
            getDashData();
        }
    }, [adminToken]);

    useEffect(() => {
        if (doctors.length > 0 || appointments.length > 0) {
            calculateStats();
        }
    }, [doctors, appointments]);

    const calculateStats = () => {
        // Calculate total doctors
        const totalDoctors = doctors.length;

        // Calculate appointment stats
        const totalAppointments = appointments.length;
        const now = new Date();
        const sevenDaysFromNow = new Date(now);
        sevenDaysFromNow.setDate(now.getDate() + 7);

        const upcomingAppointments = appointments.filter(app => {
            if (app.cancelled || app.isCompleted) return false;

            // Assuming slotDate is in "DD_MM_YYYY" format
            const [day, month, year] = app.slotDate.split('_');
            const appointmentDate = new Date(`${year}-${month}-${day}`);

            return appointmentDate >= now && appointmentDate <= sevenDaysFromNow;
        }).length;

        const canceledAppointments = appointments.filter(app => app.cancelled).length;

        // Calculate total revenue (sum of all completed appointments)
        const revenue = appointments.reduce((total, app) => {
            return app.isCompleted && !app.cancelled ? total + (app.amount || 0) : total;
        }, 0);

        // Get recent appointments (last 5)
        const recent = [...appointments]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5)
            .map(app => ({
                id: app._id,
                patient: `${app.userData?.firstname || ''} ${app.userData?.lastname || ''}`,
                doctor: app.docData?.name || 'N/A',
                date: app.slotDate.split('_').reverse().join('-'), // Convert DD_MM_YYYY to YYYY-MM-DD
                time: app.slotTime,
                status: app.cancelled ? 'canceled' : app.isCompleted ? 'completed' : 'pending'
            }));

        // Note: Total users would need to be fetched separately as it's not in current context
        // For now, we'll use a placeholder or you can add this to your AdminContext
        const totalUsers = 0; // You'll need to implement this

        setStats({
            totalDoctors,
            totalAppointments,
            upcomingAppointments,
            canceledAppointments,
            totalUsers,
            revenue,
        });

        setRecentAppointments(recent);
    };

    // Chart data based on real appointments
    const appointmentTrendData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Appointments',
                data: dashData.monthlyAppointments || Array(12).fill(0),
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    const revenueData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'Revenue (in ₹)',
            data: dashData.monthlyRevenue || Array(12).fill(0),
            backgroundColor: 'rgba(79, 70, 229, 0.5)',
        }]
    };

    return (
        <div className="min-h-screen w-full bg-gray-50 p-4 md:p-5 overflow-y-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-5">Dashboard Overview</h1>

            {/* Stats Cards - unchanged */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Doctors Card */}
                <div className="bg-white rounded-lg shadow-xl hover:scale-105 transition-all duration-500 p-4 flex items-center">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                        <FaUserMd size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Doctors</p>
                        <h3 className="text-2xl font-bold text-gray-800">{dashData.doctors}</h3>
                        <p className="text-green-500 text-xs mt-1">+0 from last month</p>
                    </div>
                </div>

                {/* Total Appointments Card */}
                <div className="bg-white rounded-lg shadow-xl hover:scale-105 transition-all duration-500 p-4 flex items-center">
                    <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                        <FaCalendarAlt size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Appointments</p>
                        <h3 className="text-2xl font-bold text-gray-800">{dashData.appointments}</h3>
                        <p className="text-green-500 text-xs mt-1">+0% from last month</p>
                    </div>
                </div>

                {/* Upcoming Appointments Card */}
                <div className="bg-white rounded-lg shadow-xl hover:scale-105 transition-all duration-500 p-4 flex items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                        <FaCalendarCheck size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Upcoming Appointments</p>
                        <h3 className="text-2xl font-bold text-gray-800">{dashData.upcomingAppointments}</h3>
                        <p className="text-blue-500 text-xs mt-1">Next 7 days</p>
                    </div>
                </div>

                {/* Canceled Appointments Card */}
                <div className="bg-white rounded-lg shadow-xl hover:scale-105 transition-all duration-500 p-4 flex items-center">
                    <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
                        <FaCalendarTimes size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Canceled Appointments</p>
                        <h3 className="text-2xl font-bold text-gray-800">{dashData.canceledAppointments}</h3>
                        <p className="text-red-500 text-xs mt-1">+0 from last week</p>
                    </div>
                </div>
            </div>

            {/* Second Row - Charts with responsive fixes */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Appointment Trends Chart - now responsive */}
                <div className="bg-white rounded-lg shadow-xl p-4 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Appointment Trends</h3>
                    <div className="relative h-64 sm:h-80 md:h-96">
                        <Bar
                            data={appointmentTrendData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                },
                                scales: {
                                    x: {
                                        ticks: {
                                            autoSkip: true,
                                            maxRotation: 0,
                                            minRotation: 0
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Revenue Card - now responsive */}
                <div className="bg-white rounded-lg shadow-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Revenue</h3>
                        <div className="p-2 rounded-full bg-indigo-100 text-indigo-600">
                            <FaChartLine size={20} />
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-4xl font-bold text-gray-800 mb-2">₹{stats.revenue.toLocaleString()}</p>
                        <p className="text-green-500 text-sm mb-4">+0% from last month</p>
                        <div className="relative h-48 sm:h-56 md:h-64">
                            <Bar
                                data={revenueData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            display: false,
                                        },
                                    },
                                    scales: {
                                        x: {
                                            ticks: {
                                                autoSkip: true,
                                                maxRotation: 0,
                                                minRotation: 0
                                            }
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Third Row - Recent Appointments and Revenue */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Appointments */}
                <div className="bg-white rounded-lg shadow-xl p-4 lg:col-span-2 overflow-x-auto">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Appointments</h3>
                    <div className="min-w-[600px] sm:min-w-0">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {recentAppointments.map((appointment) => (
                                    <tr key={appointment.id}>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {appointment.patient.trim() || 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{appointment.doctor}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                            {appointment.date} at {appointment.time}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs rounded-full ${appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Additional Info Section */}
                <div className="grid grid-cols-1 gap-6">
                    {/* Total Users Card */}
                    <div className="bg-white rounded-lg shadow-xl hover:scale-105 transition-all duration-500 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Users</p>
                                <h3 className="text-2xl font-bold text-gray-800">{dashData.users}</h3>
                                <p className="text-green-500 text-xs mt-1">+0% from last month</p>
                            </div>
                            <div className="p-3 rounded-full bg-teal-100 text-teal-600">
                                <FaUsers size={24} />
                            </div>
                        </div>
                    </div>

                    {/* System Health Card */}
                    <div className="bg-white rounded-lg shadow-xl hover:scale-105 transition-all duration-500 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">System Health</p>
                                <h3 className="text-2xl font-bold text-gray-800">Optimal</h3>
                                <p className="text-green-500 text-xs mt-1">All systems operational</p>
                            </div>
                            <div className="p-3 rounded-full bg-green-100 text-green-600">
                                <FaProcedures size={24} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;