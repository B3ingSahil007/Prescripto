import AOS from 'aos';
import 'aos/dist/aos.css';
import { Routes, Route, useNavigate } from 'react-router-dom'
import { useContext, useEffect } from 'react';
import { toast, ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import Profile from './pages/Profile'
import MyAppointments from './pages/MyAppointments'
import Appointment from './pages/Appointment'
import Navbar from './components/Navbar'
import Footer from './components/Footer';
import { AppContext } from './context/AppContext';

const App = () => {
  // Youtube Time: 15:53:00
  // Figma: https://www.figma.com/design/ZLkjwG5ehxNRrC4SUA2WG7/Prescripto---UI-Design?node-id=0-1&p=f&t=nyiWlciroPSNonhA-0
  // Project Start Date: 16-05-2025
  // Project End Date: 01-07-2025

  const isLoginPage = location.pathname === '/login';
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { loadUserData } = useContext(AppContext);

  useEffect(() => {
    if (!token) {
      loadUserData();
      navigate('/login');
      // toast.error('Unauthorized, Please Login');
    }
  }, [token]);


  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      delay: 100,
      offset: 200
    });
  }, []);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" transition={Zoom} />
      <Navbar />
      <div className='mx-4 sm:mx-[10%]'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:speciality" element={<Doctors />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/myprofile" element={<Profile />} />
          <Route path="/myappointments" element={<MyAppointments />} />
          <Route path="/appointment/:docId" element={<Appointment />} />
        </Routes>
        {!isLoginPage && <Footer />}
      </div>
    </>
  )
}

export default App
