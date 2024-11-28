import React, { useContext, useEffect, useState } from 'react'
import {NavLink, useNavigate} from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import {jwtDecode} from 'jwt-decode';

const NavBar = () => {
    const logo = 'https://res.cloudinary.com/dspuitf5t/image/upload/v1732230244/logo_zeknik.svg'
    const menu_icon = 'https://res.cloudinary.com/dspuitf5t/image/upload/v1732231732/menu_icon_djs1ts.svg'
    const cross_icon = 'https://res.cloudinary.com/dspuitf5t/image/upload/v1732231731/cross_icon_fkqsbh.svg'
    const dropdown_icon = 'https://res.cloudinary.com/dspuitf5t/image/upload/v1732231809/dropdown_icon_losvao.svg'

    const navigate = useNavigate();

    const {token, setToken, userData} = useContext(AppContext)
    const [showMenu, setShowMenu] = useState(false)

    const logout = ()=>{
        setToken(false)
        localStorage.removeItem('token')
        navigate('/')
    }

    const isTokenExpired = (token) => {
        if (!token) return true;
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            return decodedToken.exp < currentTime;
        } catch (error) {
            console.error('Error decoding token:', error);
            return true;
        }
    }

    useEffect(() => {
        if (localStorage.getItem('token')) {
          const token = localStorage.getItem('token');
          if (isTokenExpired(token)) {
            localStorage.removeItem('token');
            setToken(false)
            navigate('/login');
          }
        }
      }, [token]);

    
  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
        <img onClick={()=>navigate('/')} className='w-40 cursor-pointer' src={logo} alt="" />
        <ul className='hidden md:flex items-start gap-5 font-medium'>
            <NavLink to={'/'}>
                <li className='py-1'>HOME</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
            </NavLink>
            <NavLink to={'/doctors'}>
                <li className='py-1'>ALL DOCTORS</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
            </NavLink>
            <NavLink to={'/second-opinion'}>
                <li className='py-1'>GET SECOND OPINION</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
            </NavLink>
            <NavLink to={'/about'}>
                <li className='py-1'>ABOUT</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
            </NavLink>
            <NavLink to={'/contact'}>
                <li className='py-1'>CONTACT</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
            </NavLink>
        </ul>
        <div className='flex items-center gap-4'>
            {
                token 
                ? <div className='flex items-center gap-2 cursor-pointer group relative'>
                    <img className='w-8 rounded-full' src={userData.image} alt=''/>
                    <img className='w-2.5' src={dropdown_icon} alt="" />
                    <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block'>
                        <div className='min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4'>
                            <p onClick={()=>navigate('my-profile')} className='hover:text-black cursor-pointer'>My Profile</p>
                            <p onClick={()=>navigate('my-appointments')} className='hover:text-black cursor-pointer'>My Appointments</p>
                            <p onClick={()=>navigate('my-reports')} className='hover:text-black cursor-pointer'>My Reports</p>
                            <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                        </div>
                    </div>
                </div>
                : <button onClick={()=>navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block'>Login / Sign Up</button>
            }

            <img className='w-6 md:hidden' src={menu_icon} onClick={()=>setShowMenu(true)} alt="" />
            {/* -------------Mobile Menu--------------- */}
            <div className={`${showMenu ? 'fixed w-full': 'h-0 w-0'} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}>
                <div className='flex items-center justify-between px-5 py-6'>
                    <img className='w-36' src={logo} alt="" />
                    <img className='w-7' onClick={()=>setShowMenu(false)} src={cross_icon} alt="" />
                </div>
                <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
                    <NavLink to='/' onClick={()=>setShowMenu(false)}><p className='px-4 py-2 rounded inline-block'>Home</p></NavLink>
                    <NavLink to='/doctors' onClick={()=>setShowMenu(false)} ><p className='px-4 py-2 rounded inline-block'>All Doctors</p></NavLink>
                    <NavLink to='/second-opinion' onClick={()=>setShowMenu(false)} ><p className='px-4 py-2 rounded inline-block'>Get Second Opinion</p></NavLink>
                    <NavLink to='/about' onClick={()=>setShowMenu(false)} ><p className='px-4 py-2 rounded inline-block'>About</p></NavLink>
                    <NavLink to='/contact' onClick={()=>setShowMenu(false)} ><p className='px-4 py-2 rounded inline-block'>Contact</p></NavLink>
                </ul>
            </div>
            
        </div>
    </div>
  )
}

export default NavBar