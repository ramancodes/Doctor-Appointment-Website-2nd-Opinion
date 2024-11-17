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

const App = () => {

  const {aToken} = useContext(AdminContext)

  return aToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer/>
      <Navbar/>
      <div className='flex items-start'>
        <Sidebar/>
        <Routes>
          <Route path='/' element={<></>} />
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-appointments' element={<AllApointments />} />
          <Route path='/add-doctor' element={<AddDoctor />} />
          <Route path='/doctor-list' element={<DoctorsList />} />
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