import { useContext, useState } from 'react'
import { AdminContext } from '../context/AdminContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { DoctorContext } from '../context/DoctorContext';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets_admin/assets';

const Login = () => {
    const [state, setState] = useState('Admin');
    const { setAdminToken, backendUrl } = useContext(AdminContext);
    const { setDoctorToken } = useContext(DoctorContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [currentSlogan, setCurrentSlogan] = useState(0);

    const slogans = [
        "Your Health, Our Priority",
        "Connecting Patients with Care",
        "Advanced Medical Solutions",
        "24/7 Healthcare Access"
    ];

    // Rotate slogans every 3 seconds
    useState(() => {
        const interval = setInterval(() => {
            setCurrentSlogan((prev) => (prev + 1) % slogans.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const onLoginFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (state === 'Admin') {
                const { data } = await axios.post(`${backendUrl}/api/admin/login`, { email, password });
                if (data.success) {
                    localStorage.setItem('adminToken', data.token);
                    setAdminToken(data.token);
                    toast.success(data.message);
                    navigate('/admin');
                } else {
                    toast.error(data.message);
                }
            } else {
                const { data } = await axios.post(`${backendUrl}/api/doctor/login`, { email, password });
                if (data.success) {
                    localStorage.setItem('doctorToken', data.token);
                    setDoctorToken(data.token);
                    toast.success(data.message);
                    navigate('/doctor');
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            console.error('Invalid Credentials', error?.response?.data || error.message);
            toast.error('Invalid Credentials', error?.response?.data || error.message);
        }
    }

    return (
        <div className="min-h-screen bg-blue-200 flex items-center justify-center p-4">
            <div className="w-full max-w-7xl bg-blue-600 rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
                {/* Dynamic Form Positioning */}
                {state === 'Admin' ? (
                    <>
                        {/* Left Side - Login Form (White) */}
                        <div className="w-full md:w-1/2 p-8 md:p-12 bg-white">
                            <div className="mb-8 text-center">
                                <h1 className="text-3xl font-bold text-gray-800">
                                    Welcome to <span className="text-blue-600">Prescripto</span>
                                </h1>
                                <p className="text-gray-500 mt-2">
                                    Administrator Portal
                                </p>
                            </div>

                            <form onSubmit={onLoginFormSubmit} className="space-y-6">
                                {/* Form fields remain the same */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                            Remember me
                                        </label>
                                    </div>

                                    <div className="text-sm">
                                        <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                            Forgot password?
                                        </a>
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
                                    >
                                        Sign in
                                    </button>
                                </div>
                            </form>

                            <div className="mt-6 text-center">
                                <button
                                    onClick={() => setState('Doctor')}
                                    className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                                >
                                    Are you a Doctor? Switch to Doctor Login
                                </button>
                            </div>
                        </div>

                        {/* Right Side - Branding (Blue) */}
                        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 flex-col items-center justify-center p-12 text-white">
                            <div>
                                <img 
                                    src={assets.logo} 
                                    alt="Hospital Logo" 
                                    className="h-32 w-60 mx-auto"
                                />
                            </div>

                            <div className="h-20 flex items-center justify-center">
                                {slogans.map((slogan, index) => (
                                    <p 
                                        key={index}
                                        className={`text-xl text-center transition-opacity duration-1000 absolute ${
                                            currentSlogan === index ? 'opacity-100' : 'opacity-0'
                                        }`}
                                    >
                                        {slogan}
                                    </p>
                                ))}
                            </div>

                            <div className="mt-auto pt-8 text-center">
                                <p className="text-blue-200">Need help?</p>
                                <p className="font-medium">contact@prescripto.com</p>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Right Side - Login Form (White) */}
                        <div className="hidden md:flex md:w-1/2 p-8 md:p-12 bg-white order-2">
                            <div className="w-full">
                                <div className="mb-8 text-center">
                                    <h1 className="text-3xl font-bold text-gray-800">
                                        Welcome to <span className="text-blue-600">Prescripto</span>
                                    </h1>
                                    <p className="text-gray-500 mt-2">
                                        Doctor Portal
                                    </p>
                                </div>

                                <form onSubmit={onLoginFormSubmit} className="space-y-6">
                                    {/* Same form fields as above */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                            Email Address
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                            Password
                                        </label>
                                        <input
                                            id="password"
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <input
                                                id="remember-me"
                                                name="remember-me"
                                                type="checkbox"
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                                Remember me
                                            </label>
                                        </div>

                                        <div className="text-sm">
                                            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                                Forgot password?
                                            </a>
                                        </div>
                                    </div>

                                    <div>
                                        <button
                                            type="submit"
                                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300"
                                        >
                                            Sign in
                                        </button>
                                    </div>
                                </form>

                                <div className="mt-6 text-center">
                                    <button
                                        onClick={() => setState('Admin')}
                                        className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                                    >
                                        Are you an Admin? Switch to Admin Login
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Left Side - Branding (Blue) */}
                        <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 flex-col items-center justify-center p-12 text-white order-1">
                            <div>
                                <img 
                                    src={assets.logo} 
                                    alt="Hospital Logo" 
                                    className="h-32 w-60 mx-auto"
                                />
                            </div>

                            <div className="h-20 flex items-center justify-center">
                                {slogans.map((slogan, index) => (
                                    <p 
                                        key={index}
                                        className={`text-xl text-center transition-opacity duration-1000 absolute ${
                                            currentSlogan === index ? 'opacity-100' : 'opacity-0'
                                        }`}
                                    >
                                        {slogan}
                                    </p>
                                ))}
                            </div>

                            <div className="mt-auto pt-8 text-center">
                                <p className="text-blue-200">Need help?</p>
                                <p className="font-medium">contact@prescripto.com</p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Login;