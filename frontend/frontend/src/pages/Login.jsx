import { useContext, useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const Login = () => {
    const { token, setToken, backendUrl, setUserData } = useContext(AppContext);
    const [state, setState] = useState('Log In');
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState('');
    const [dob, setBirthDate] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        AOS.init({
            duration: 600,
            once: true,
        });
    }, []);

    useEffect(() => {
        setTimeout(() => {
            AOS.refresh();
        }, 100);
    }, [state]);

    const onSubmit = async (e) => {
        e.preventDefault();

        if (state === 'Sign Up') {
            try {
                const { data } = await axios.post(`${backendUrl}/api/user/register`, {
                    firstname, lastname, address, gender, dob, email, phone, password, confirmPassword
                });
                if (data.success) {
                    localStorage.setItem('token', data.token);
                    setFirstName(''); setLastName(''); setAddress(''); setGender(''); setBirthDate('');
                    setEmail(''); setPhone(''); setPassword(''); setConfirmPassword('');
                    setToken(data.token);
                    setState('Log In');
                    scrollTo(0, 0);
                    toast.success(data.message);
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                console.error('Error Signing Up', error?.response?.data || error.message);
                toast.error('Error Signing Up');
            }
        } else {
            // Login Logic
            try {
                const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password });
                if (data.success) {
                    // Token save करना
                    localStorage.setItem('token', data.token);

                    // User data save करना
                    const userInfo = {
                        firstname: data.user.firstname,
                        lastname: data.user.lastname,
                        email: data.user.email
                    };
                    localStorage.setItem('userData', JSON.stringify(userInfo));

                    // Context में set करना
                    setToken(data.token);
                    setUserData(userInfo);

                    navigate('/');
                    toast.success(data.message);
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                console.error('Error Logging In', error?.response?.data || error.message);
                toast.error('Error Logging In');
            }
        }
    };

    useEffect(() => {
        if (token) {
            navigate('/');
        }
    }, [token]);

    return (
        <>
            <Helmet>
                <title>Prescripto - {state}</title>
                <meta name="description" content={`${state} Page`} />
                <link rel="canonical" href="/login" />
            </Helmet>
            <div className='my-4 mb-5 sm:px-6 lg:px-8'>
                <form key={state} data-aos="zoom-in" onSubmit={onSubmit} className='min-h-[80vh] flex items-center justify-center' >
                    <div className='grid gap-4 m-auto p-4 sm:p-8 border rounded-xl text-gray-700 shadow-xl bg-blue-100 w-full max-w-4xl grid-cols-1 md:grid-cols-2'>
                        <div className='md:col-span-2'>
                            <p className='text-xl sm:text-2xl font-semibold text-primary'>{state === 'Sign Up' ? 'Create Account' : 'Log In'}</p>
                            <p className='text-sm sm:text-base'>Please {state === 'Sign Up' ? 'Sign Up' : 'Log In'} here to book an appointment with a doctor.</p>
                        </div>

                        {state === 'Sign Up' &&
                            <>
                                <div className='w-full'>
                                    <p className='text-sm sm:text-base'>First Name</p>
                                    <input className='border !border-blue-300 rounded w-full p-1 sm:p-2 mt-1 focus:outline-none focus:ring-1 focus:ring-primary text-sm sm:text-base' type="text" value={firstname} onChange={(e) => setFirstName(e.target.value)} />
                                </div>
                                <div className='w-full'>
                                    <p className='text-sm sm:text-base'>Last Name</p>
                                    <input className='border !border-blue-300 rounded w-full p-1 sm:p-2 mt-1 focus:outline-none focus:ring-1 focus:ring-primary text-sm sm:text-base' type="text" value={lastname} onChange={(e) => setLastName(e.target.value)} />
                                </div>
                                <div className='w-full md:col-span-2'>
                                    <p className='text-sm sm:text-base'>Address</p>
                                    <input className='border !border-blue-300 rounded w-full p-1 sm:p-2 mt-1 focus:outline-none focus:ring-1 focus:ring-primary text-sm sm:text-base' type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                                </div>
                                <div className=''>
                                    <p className='text-sm sm:text-base'>Gender</p>
                                    <div className='flex gap-4 mt-1 flex-wrap'>
                                        <div className='flex items-center gap-1'>
                                            <input type="radio" name="gender" id="male" value="male" checked={gender === 'male'} onChange={(e) => setGender(e.target.value)} />
                                            <label htmlFor="male" className='text-sm sm:text-base'>Male</label>
                                        </div>
                                        <div className='flex items-center gap-1'>
                                            <input type="radio" name="gender" id="female" value="female" checked={gender === 'female'} onChange={(e) => setGender(e.target.value)} />
                                            <label htmlFor="female" className='text-sm sm:text-base'>Female</label>
                                        </div>
                                        <div className='flex items-center gap-1'>
                                            <input type="radio" name="gender" id="other" value="other" checked={gender === 'other'} onChange={(e) => setGender(e.target.value)} />
                                            <label htmlFor="other" className='text-sm sm:text-base'>Other</label>
                                        </div>
                                    </div>
                                </div>
                                <div className='w-full'>
                                    <p className='text-sm sm:text-base'>Birth Date</p>
                                    <input className='border !border-blue-300 rounded w-full p-1 sm:p-2 mt-1 focus:outline-none focus:ring-1 focus:ring-primary text-sm sm:text-base' type="date" value={dob} onChange={(e) => setBirthDate(e.target.value)} />
                                </div>
                            </>
                        }

                        <div className='w-full'>
                            <p className='text-sm sm:text-base'>Email</p>
                            <input className='border !border-blue-300 rounded w-full p-1 sm:p-2 mt-1 focus:outline-none focus:ring-1 focus:ring-primary text-sm sm:text-base' type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>

                        {state === 'Sign Up' &&
                            <div className='w-full'>
                                <p className='text-sm sm:text-base'>Phone</p>
                                <input className='border !border-blue-300 rounded w-full p-1 sm:p-2 mt-1 focus:outline-none focus:ring-1 focus:ring-primary text-sm sm:text-base' type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </div>
                        }

                        <div className='w-full'>
                            <p className='text-sm sm:text-base'>Password</p>
                            <input className='border !border-blue-300 rounded w-full p-1 sm:p-2 mt-1 focus:outline-none focus:ring-1 focus:ring-primary text-sm sm:text-base' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>

                        {state === 'Sign Up' &&
                            <div className='w-full'>
                                <p className='text-sm sm:text-base'>Confirm Password</p>
                                <input className='border !border-blue-300 rounded w-full p-1 sm:p-2 mt-1 focus:outline-none focus:ring-1 focus:ring-primary text-sm sm:text-base' type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            </div>
                        }

                        <div className='md:col-span-2 flex flex-col items-center'>
                            <button className='bg-primary text-white text-sm sm:text-base py-2 px-6 sm:px-8 mt-2 rounded hover:scale-105 transition-all duration-300 w-full sm:w-auto' type='submit'>
                                {state === 'Sign Up' ? 'Create Account' : 'Log In'}
                            </button>
                            {state === 'Sign Up' ? (
                                <p className='text-sm sm:text-base mt-2'>
                                    Already have an account?{' '}
                                    <span className='text-primary font-semibold cursor-pointer' onClick={() => { scrollTo(0, 0), setState('Log In') }}>Log In</span>
                                </p>
                            ) : (
                                <p className='text-sm sm:text-base mt-2'>
                                    Don't have an account?{' '}
                                    <span className='text-primary font-semibold cursor-pointer' onClick={() => { scrollTo(0, 0), setState('Sign Up') }}>Click Here</span>
                                </p>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default Login;