import React, { useContext } from 'react'
import Login from './pages/login.jsx'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from './context/AdminContext.jsx';
import Navbar from './components/navBar.jsx';
import Sidebar from './components/Sidebar.jsx';
import { Route, Routes } from 'react-router-dom';
import AddDoctor from './pages/Admin/AddDoctor.jsx';
import AllApointments from './pages/Admin/AllApointments.jsx';
import Dashboard from './pages/Admin/Dashboard.jsx';
import DoctorsList from './pages/Admin/DoctorsList.jsx';
import { DoctorContext } from './context/DoctorContext.jsx';
import DoctorDashboard from './pages/Doctor/DoctorDashboard.jsx';
import DoctorAppointment from './pages/Doctor/DoctorAppointment.jsx';
import DoctorProfile from './pages/Doctor/DoctorProfile.jsx';
import DoctorReports from './pages/Doctor/DoctorReports.jsx';

const App = () => {

  const {aToken} = useContext(AdminContext)
  const {dToken} = useContext(DoctorContext)

  return aToken || dToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer/>
      <Navbar/>
      <div className='flex items-start'>
        <Sidebar/>
        <Routes>
          <Route path='/' element={
            <div className='flex flex-col items-center text-center'>
              <div className='m-10 text-8xl text-gray-600'>
                <p>Welcome to <span className='text-primary'>{aToken ? 'Admin' : 'Doctor'}</span> Panel </p>
              </div>
              <div className='m-10 text-sm text-gray-400'>
                <p>Developed By Raman Kumar Manjhi</p>
                <p>Copyright © 2024, Raman - All Right Reserved.</p>
              </div>
            </div>
          } />
          {/* Admin Routes */}
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-appointments' element={<AllApointments />} />
          <Route path='/add-doctor' element={<AddDoctor />} />
          <Route path='/doctor-list' element={<DoctorsList />} />

          {/* Doctor Routes */}
          <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
          <Route path='/doctor-appointments' element={<DoctorAppointment />} />
          <Route path='/doctor-profile' element={<DoctorProfile />} />
          <Route path='/doctor-reports' element={<DoctorReports />} />
        </Routes>
      </div>
    </div>
  ) 
  : (
    <>
    <Login />
    <ToastContainer/>
    </>
  )
}

export default App