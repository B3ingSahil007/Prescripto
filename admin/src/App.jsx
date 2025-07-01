import { useContext } from 'react';
import Login from './pages/Login'
import { ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AllAppointments from './pages/AllAppointments';
import AddDoctor from './pages/AddDoctor';
import DoctorList from './pages/DoctorList';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import { DoctorContext } from './context/DoctorContext';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorAppointments from './pages/DoctorAppointments';
import DoctorProfile from './pages/DoctorProfile';

const App = () => {
  const { adminToken } = useContext(AdminContext);
  const { doctorToken } = useContext(DoctorContext);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      delay: 100,
      offset: 200
    });
  }, []);

  return adminToken || doctorToken ? (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" transition={Zoom} />
      <div className='bg-[#F8F9FD]'>
        <Navbar />
        <div className='flex items-start'>
          <Sidebar />
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/all-appointments" element={<AllAppointments />} />
            <Route path="/add-doctor" element={<AddDoctor />} />
            <Route path="/doctor-list" element={<DoctorList />} />

            {/* Doctor Routes */}
            <Route path="/doctor" element={<DoctorDashboard />} />
            <Route path="/doctor-appointments" element={<DoctorAppointments />} />
            <Route path="/doctor-profile" element={<DoctorProfile />} />
          </Routes>
        </div>
      </div>
    </>
  ) : (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" transition={Zoom} />
      <div>
        <Login />
      </div>
    </>
  )
}

export default App
